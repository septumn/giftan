import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { type CurrentUserPayload } from '@/common/interfaces/current-user.interface'

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): CurrentUserPayload | null => {
    const ctx = GqlExecutionContext.create(context).getContext()
    const request = ctx?.request || ctx?.req

    if (!request || !request.user) {
      return null
    }

    return request.user
  },
)
