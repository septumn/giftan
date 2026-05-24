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