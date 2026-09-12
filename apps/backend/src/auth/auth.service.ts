import { Injectable, Inject, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { GraphQLError } from 'graphql'
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

interface JwtPayloadUser {
  id: string
  email: string | null
  role: string | UserRole
}

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
        throw new GraphQLError('Name and email already exist', {
          extensions: {
            code: 'NAME_AND_EMAIL_TAKEN',
            field: ['name', 'email'],
            action: 'REGISTRATION',
          },
        })
      }

      if (isNameConflict) {
        throw new GraphQLError('A user with that name already exists', {
          extensions: {
            code: 'NAME_ALREADY_EXISTS',
            field: 'name',
            action: 'REGISTRATION',
          },
        })
      }
      if (isEmailConflict) {
        throw new GraphQLError('A user with this email already exists', {
          extensions: {
            code: 'EMAIL_ALREADY_EXISTS',
            field: 'email',
            action: 'REGISTRATION',
          },
        })
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

      const { password: _, ...userWithoutPassword } = newUser

      return {
        success: true,
        user: {
          ...userWithoutPassword,
          emailVerified: userWithoutPassword.emailVerified || null,
          role: userWithoutPassword.role as UserRole
        }
      }
    } catch (error) {
      console.error("Registration error:", error)
      throw new InternalServerErrorException("Something went wrong while saving the data.")
    }
  }

  async login(dto: LoginInputDto): Promise<LoginResponseDto> {
    if (!dto || !dto.email) {
      return { success: false, error: 'Internal error: data did not reach the service' };
    }

    const user = await this.validateUser(dto.email.trim().toLowerCase(), dto.password);

    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    if (!user.emailVerified) {
      return { success: false, error: 'Please confirm your email before logging in' };
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

    const { password: _, ...result } = user
    return result
  }

  async generateAccessToken(userOrId: JwtPayloadUser | string) {
    const secretString = process.env.JWT_SECRET;
    if (!secretString) {
      throw new InternalServerErrorException("JWT_SECRET is not set in the backend environment variables");
    }

    let targetUser: JwtPayloadUser;

    if (typeof userOrId === 'string') {
      const [foundUser] = await this.db
        .select({ id: users.id, email: users.email, role: users.role })
        .from(users)
        .where(eq(users.id, userOrId))
        .limit(1);

      if (!foundUser) {
        throw new NotFoundException('User not found');
      }
      targetUser = foundUser;
    } else {
      targetUser = userOrId;
    }

    if (!targetUser.email) {
      throw new InternalServerErrorException("User does not have a valid email address for JWT");
    }

    const secret = Buffer.from(secretString, 'utf-8');

    try {
      const accessToken = await new SignJWT({
        email: targetUser.email,
        role: targetUser.role
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject(targetUser.id)
        .setIssuedAt()
        .setExpirationTime('14d')
        .sign(secret);

      return { accessToken };
    } catch (jwtError) {
      console.error('==> [SignJWT] Error inside the jose library:', jwtError);
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
      throw new GraphQLError('Token not found or already used', {
        extensions: { code: 'INVALID_OR_EXPIRED_TOKEN' },
      })
    }

    if (new Date(existingToken.expires) < new Date()) {
      await this.db.delete(activateTokens).where(eq(activateTokens.token, token))
      throw new GraphQLError('The token has expired', {
        extensions: { code: 'TOKEN_EXPIRED' },
      })
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
        throw new GraphQLError('The user associated with this token was not found', {
          extensions: { code: 'USER_NOT_FOUND' },
        })
      }

      return {
        success: true,
        emailVerified: updatedUser.emailVerified ? updatedUser.emailVerified.toISOString() : null
      }
    } catch (error) {
      if (error instanceof GraphQLError) throw error
      console.error("Token verification error:", error)
      throw new InternalServerErrorException("Failed to verify email")
    }
  }

  async getTokenDispatchTime(email: string): Promise<number | null> {
    const cleanEmail = email.trim().replaceAll(' ', '').toLowerCase()

    const dispatchTime = await this.db
      .select()
      .from(activateTokens)
      .where(eq(activateTokens.email, cleanEmail))
      .limit(1)

    if (dispatchTime.length === 0) return null

    return new Date(dispatchTime[0].expires).getTime()
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