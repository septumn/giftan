import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"

@Injectable()
export class SetAccessTokenInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data && data.success && data.accessToken) {
          const gqlContext = GqlExecutionContext.create(context)
          const ctx = gqlContext.getContext()
          const reply = ctx.reply || ctx.res

          if (reply && typeof reply.setCookie === 'function') {
            reply.setCookie('accessToken', data.accessToken, {
              path: '/',
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
              maxAge: 60 * 60 * 24 * 14
            })
          }
        }

        return data
      })
    )
  }
}