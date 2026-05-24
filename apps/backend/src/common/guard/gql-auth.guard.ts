import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Inject } from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"
import { Reflector } from "@nestjs/core"
import { IS_PUBLIC_KEY } from "../decorators/public.decorator"
import { decode } from "@auth/core/jwt"
import Redis from "ioredis"

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private readonly reflector: Reflector
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) return true

    const ctx = GqlExecutionContext.create(context).getContext()
    const req = ctx.req || (ctx.reply && ctx.reply.requests)

    if (!req) {
      throw new UnauthorizedException('Не удалось извлечь контекст запроса Fastify')
    }

    const authHeader = req.headers.authorization
    if (!authHeader) {
      throw new UnauthorizedException('Токен авторизации отсутсвует')
    }

    const [type, token] = authHeader.split(' ')
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Неверный формат заголовка Authorization')
    }

    try {
      const secret = process.env.AUTH_SECRET
      if (!secret) {
        throw new Error('AUTH_SECRET не задан в переменных окружения бэкенда')
      }

      const isSecureToken = authHeader.includes('__Secure-') || req.headers['x-forwarded-proto'] === 'https'
      const cookieName = isSecureToken ? '__Secure-authjs.session-token' : 'authjs.session-token'

      const payload = await decode({
        token,
        secret,
        salt: cookieName
      })

      const userId = (payload?.id || payload?.sub) as string

      if (!payload || !userId) {
        throw new UnauthorizedException('В токене отсутсвует ID пользователя')
      }

      const isBlacklisted = await this.redis.get(`blacklist:${userId}`)
      console.log(`[REDIS CHECK] Проверяем ID: ${userId}. Найдено в блэклисте: ${!isBlacklisted}`)

      if (isBlacklisted) {
        throw new UnauthorizedException('Сессия была аннулирована (выполнен Logout)')
      }

      req.user = {
        id: userId,
        email: payload.email,
        name: payload.name,
        emailVerified: payload.emailVerified ? new Date(payload.emailVerified as string) : null
      }

      return true
    } catch (error) {
      console.error('[GqlAuthGuard Error Dev Debug]: ', error)

      throw new UnauthorizedException('Недействительный или просроченный токен сессии')
    }
  }
}