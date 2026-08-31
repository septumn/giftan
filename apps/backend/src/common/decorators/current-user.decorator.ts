<<<<<<< HEAD
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
=======
import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context).getContext();

    const request = ctx.req || (ctx.reply && ctx.reply.request);
    
    if (!request || !request.user) {
      return null;
    }
    
    return request.user;
  },
);
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
