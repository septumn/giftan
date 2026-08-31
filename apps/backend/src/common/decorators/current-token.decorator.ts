import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

export const CurrentToken = createParamDecorator(
  (data: unknown, context: ExecutionContext): string | null => {
    const ctx = GqlExecutionContext.create(context).getContext()
    const request = ctx?.request || ctx?.req

    if (!request || !request.cookies) {
      return null
    }

    return request.cookies.access_token || null
  },
)