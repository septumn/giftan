import { Injectable, Inject, BadRequestException, InternalServerErrorException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { DRIZZLE, type DrizzleDB } from "../db/db.module"
import { users, activateTokens } from "../db/schema"
import { eq, or } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"
import { MailService } from '../mail/mail.service'
import { RegisterResponse } from './dto/responses/register.response'
import { VerifyResponse } from './dto/responses/verify.response'
import { UserRole } from '../common/enums/role.enum'

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly mailService: MailService
  ) { }

  async registerCredentials(email: string, name: string, password: string): Promise<RegisterResponse> {
    const [existing] = await this.db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.name, name)))
      .limit(1)

    if (existing) {
      throw new BadRequestException("Пользователь с таким email или именем уже существует")
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const token = uuidv4()
    const confirmLink = `${process.env.NEXT_APP_URL}/auth/verification?token=${token}`

    await this.mailService.sendVerificationEmail(email, confirmLink)

    try {
      const [newUser] = await this.db.transaction(async (tx) => {
        const [insertedUser] = await tx
          .insert(users)
          .values({
            email,
            name,
            password: hashedPassword,
            confirmationSentAt: new Date()
          })
          .returning()

        await tx.insert(activateTokens).values({
          email,
          token,
          expires: new Date(Date.now() + 3600 * 1000)
        })

        return [insertedUser]
      })

      if (newUser) {
        delete (newUser as any).password
      }

      return {
        success: "Пожалуйста, подтвердите почту по ссылке в письме",
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

  async validateUser(email: string, pass: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user || !user.password) return null;

    const match = await bcrypt.compare(pass, user.password);
    if (!match) return null;

    delete (user as any).password;
    return user;
  }

  async verifyToken(token: string): Promise<VerifyResponse> {
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
        emailVerified: updatedUser.emailVerified
      }
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      console.error("Ошибка верификации токена:", error)
      throw new InternalServerErrorException("Не удалось верифицировать email")
    }
  }
}