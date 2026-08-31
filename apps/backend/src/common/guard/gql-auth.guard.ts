import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Inject } from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"
import { Reflector } from "@nestjs/core"
import { IS_PUBLIC_KEY } from "../decorators/public.decorator"
<<<<<<< HEAD
import * as jose from "jose"
=======
import { decode } from "@auth/core/jwt"
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
import Redis from "ioredis"

@Injectable()
export class GqlAuthGuard implements CanActivate {
<<<<<<< HEAD
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
=======
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private readonly reflector: Reflector
  ) { }
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) return true

    const ctx = GqlExecutionContext.create(context).getContext()
<<<<<<< HEAD
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
=======
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
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
        throw new UnauthorizedException('Сессия была аннулирована (выполнен Logout)')
      }

      req.user = {
        id: userId,
<<<<<<< HEAD
        email: payload.email as string,
        role: payload.role as string
=======
        email: payload.email,
        name: payload.name,
        emailVerified: payload.emailVerified ? new Date(payload.emailVerified as string) : null
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
      }

      return true
    } catch (error) {
<<<<<<< HEAD
      if (error instanceof UnauthorizedException) throw error

      console.error('[GqlAuthGuard Error Dev Debug]: ', error)
=======
      console.error('[GqlAuthGuard Error Dev Debug]: ', error)

>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
      throw new UnauthorizedException('Недействительный или просроченный токен сессии')
    }
  }
}