import { Injectable, Inject, BadRequestException, InternalServerErrorException } from '@nestjs/common'
import { SignJWT } from 'jose'
import * as bcrypt from 'bcrypt'
import { DRIZZLE, type DrizzleDB } from "../db/db.module"
import { users, activateTokens } from "../db/schema"
import { eq, or } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"
import { MailService } from '@/mail/mail.service'
import { RegisterInputDto } from './dto/inputs/register.input'
import { RegisterResponseDto } from './dto/responses/register.response'
import { VerifyEmailResponse } from './dto/responses/verify-email.response'
import { UserRole } from '../common/enums/role.enum'
import { LoginInputDto } from './dto/inputs/login.input'
import { LoginResponseDto } from './dto/responses/login.response'
import { LogoutResponse } from './dto/responses/logout.response'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '@/users/users.service'
import Redis from 'ioredis'

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) { }

  async registerCredentials({ name, email, password }: RegisterInputDto): Promise<RegisterResponseDto> {
    const cleanName = name.trim().replaceAll(' ', '')
    const cleanEmail = email.trim().replaceAll(' ', '').toLowerCase()
    const cleanPassword = password.trim()

    const existing = await this.db
      .select()
      .from(users)
      .where(or(eq(users.name, cleanName), eq(users.email, cleanEmail)))
      .limit(2)

    if (existing.length > 0) {
      const isNameConflict = existing.some(u => u.name === cleanName)
      const isEmailConflict = existing.some(u => u.email === cleanEmail)

      if (isNameConflict && isEmailConflict) {
        throw new BadRequestException("Такое имя и Email уже заняты")
      }

      if (isNameConflict) {
        throw new BadRequestException("Пользователь с таким именем уже существует")
      }

      if (isEmailConflict) {
        throw new BadRequestException("Пользователь с таким Email уже существует")
      }
    }

    const hashedPassword = await bcrypt.hash(cleanPassword, 10)
    const token = uuidv4()
    const confirmLink = `${process.env.NEXT_APP_URL}/auth/verification?token=${token}`

    try {
      const [newUser] = await this.db.transaction(async (tx) => {
        const [insertedUser] = await tx
          .insert(users)
          .values({
            email: cleanEmail,
            name: cleanName,
            password: hashedPassword,
            confirmationSentAt: new Date()
          })
          .returning()

        await tx.insert(activateTokens).values({
          email: cleanEmail,
          token,
          expires: new Date(Date.now() + 3600 * 1000)
        })

        return [insertedUser]
      })

      await this.mailService.sendVerificationEmail(cleanEmail, confirmLink)

      if (newUser) {
        delete (newUser as any).password
      }

      return {
        success: true,
        user: {
          ...newUser,
          emailVerified: newUser.emailVerified || null,
          role: newUser.role as any as UserRole
        }
      }
    } catch (error) {
      console.error("Ошибка при регистрации:", error)
      throw new InternalServerErrorException("Что-то пошло не так при сохранении данных")
    }
  }

  async login(dto: LoginInputDto): Promise<LoginResponseDto> {
    if (!dto || !dto.email) {
      return { success: false, error: 'Внутренняя ошибка: данные не дошли до сервиса' };
    }

    const user = await this.validateUser(dto.email.trim().toLowerCase(), dto.password);

    if (!user) {
      return { success: false, error: 'Неверный Email или пароль' };
    }

    if (!user.emailVerified) {
      return { success: false, error: 'Пожалуйста, подтвердите ваш Email перед входом' };
    }

    const userBlacklisted = await this.redis.get(`blacklist:${user.id}`);
    if (userBlacklisted) await this.redis.del(`blacklist:${user.id}`);

    const tokenData = await this.generateAccessToken(user);

    return {
      success: true,
      accessToken: tokenData.accessToken
    };
  }

  async validateUser(email: string, pass: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (!user || !user.password) return null

    const match = await bcrypt.compare(pass, user.password)

    if (!match) return null

    delete (user as any).password
    return user
  }

  async generateAccessToken(user: any) {
    const secretString = process.env.JWT_SECRET;
    if (!secretString) {
      throw new InternalServerErrorException("JWT_SECRET не задан в переменных окружения бэкенда");
    }

    const secret = Buffer.from(secretString, 'utf-8');

    try {
      const accessToken = await new SignJWT({
        email: user.email,
        role: user.role
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject(user.id)
        .setIssuedAt()
        .setExpirationTime('14d')
        .sign(secret);

      return { accessToken };
    } catch (jwtError) {
      console.error('==> [SignJWT] Ошибка внутри библиотеки jose:', jwtError);
      throw jwtError;
    }
  }

  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    const [existingToken] = await this.db
      .select()
      .from(activateTokens)
      .where(eq(activateTokens.token, token))
      .limit(1)

    if (!existingToken) {
      throw new BadRequestException("Токен не найден или уже был использован")
    }

    if (new Date(existingToken.expires) < new Date()) {
      await this.db.delete(activateTokens).where(eq(activateTokens.token, token))
      throw new BadRequestException("Срок действия токена истёк")
    }

    try {
      const updatedUser = await this.db.transaction(async (tx) => {
        const [user] = await tx
          .update(users)
          .set({ emailVerified: new Date() })
          .where(eq(users.email, existingToken.email))
          .returning({ emailVerified: users.emailVerified })

        await tx.delete(activateTokens).where(eq(activateTokens.token, token))
        return user
      })

      if (!updatedUser) {
        throw new BadRequestException("Пользователь, привязанный к этому токену, не найден")
      }

      return {
        success: true,
        emailVerified: updatedUser.emailVerified ? updatedUser.emailVerified.toString() : null
      }
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      console.error("Ошибка верификации токена:", error)
      throw new InternalServerErrorException("Не удалось верифицировать email")
    }
  }

  async getTokenDispatchTime(email: string): Promise<number | null> {
    const cleanEmail = email.trim().replace(' ', '').toLowerCase()

    const dispatchTime = await this.db
      .select()
      .from(activateTokens)
      .where(eq(activateTokens.email, cleanEmail))
      .limit(1)

    if (dispatchTime.length === 0) return null

    return Number(dispatchTime[0].expires)
  }

  async logout(userId: string, reply: any): Promise<LogoutResponse> {
    try {
      const result = await this.usersService.blacklistUser(userId);

      this.clearAccessTokenCookie(reply);
      return result;

    } catch (error) {
      this.clearAccessTokenCookie(reply);
      return { success: true };
    }
  }

  private clearAccessTokenCookie(reply: any): void {
    if (!reply) return;

    if (typeof reply.setCookie === 'function') {
      reply.setCookie('access_token', '', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
        expires: new Date(0),
      });
    }
  }
}