import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Inject } from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"
import { Reflector } from "@nestjs/core"
import { IS_PUBLIC_KEY } from "../decorators/public.decorator"
import * as jose from "jose"
import Redis from "ioredis"

@Injectable()
export class GqlAuthGuard implements CanActivate {
  private readonly jwtSecret: Uint8Array

  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private readonly reflector: Reflector
  ) {
    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error('JWT_SECRET не задан в переменных окружения бэкенда')
    }
    this.jwtSecret = new TextEncoder().encode(secret)
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) return true

    const ctx = GqlExecutionContext.create(context).getContext()
    const req = ctx.req

    if (!req) {
      throw new UnauthorizedException('Не удалось извлечь контекст запроса')
    }

    let token: string | null = null

    if (req.cookies && req.cookies.access_token) {
      token = req.cookies.access_token
    }
    else if (req.headers && req.headers.authorization) {
      const [type, headerToken] = req.headers.authorization.split(' ')
      if (type === 'Bearer' && headerToken) {
        token = headerToken
      }
    }

    if (!token) {
      throw new UnauthorizedException('Токен авторизации отсутствует (нет в Cookie и Authorization Header)')
    }

    try {
      const { payload } = await jose.jwtVerify(token, this.jwtSecret)

      const userId = payload.sub
      if (!userId) {
        throw new UnauthorizedException('В токене отсутствует ID пользователя')
      }

      const isUserBlacklisted = await this.redis.get(`blacklist:${token}`)

      if (isUserBlacklisted) {
        throw new UnauthorizedException('Сессия была аннулирована (выполнен Logout)')
      }

      req.user = {
        id: userId,
        email: payload.email as string,
        role: payload.role as string
      }

      return true
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error

      console.error('[GqlAuthGuard Error Dev Debug]: ', error)
      throw new UnauthorizedException('Недействительный или просроченный токен сессии')
    }
  }
}