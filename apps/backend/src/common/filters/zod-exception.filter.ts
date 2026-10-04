import { Catch, ArgumentsHost } from '@nestjs/common'
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql'
import { ZodValidationException } from 'nestjs-zod'
import { ZodError } from 'zod'

@Catch(ZodValidationException)
export class ZodGqlExceptionFilter implements GqlExceptionFilter {
  catch(exception: ZodValidationException, host: ArgumentsHost) {
    GqlArgumentsHost.create(host)

    const zodError = exception.getZodError() as ZodError
    const firstError = zodError.errors[0]?.message || 'Ошибка валидации'

    return {
      success: false,
      error: firstError
    }
  }
}