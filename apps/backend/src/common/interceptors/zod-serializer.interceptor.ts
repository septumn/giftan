import { CallHandler, ExecutionContext, Injectable, InternalServerErrorException, NestInterceptor, UseInterceptors } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { z, ZodError, ZodSchema } from 'zod'

@Injectable()
export class ZodSerializerInterceptor implements NestInterceptor {
  constructor(private schema: z.ZodSchema) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (!data) return data

        try {
          if (Array.isArray(data)) {
            return data.map((item) => this.schema.parse(item))
          }

          return this.schema.parse(data)
        } catch (error) {
          if (error instanceof ZodError) {
            throw new InternalServerErrorException({
              message: 'Failed to serialize server response',
              errors: error.errors.map((e) => ({ path: e.path.join('.'), message: e.message }))
            })
          }

          throw error
        }
      })
    )
  }
}

export const UseZodSerializerInterceptor = (schema: ZodSchema) =>
  UseInterceptors(new ZodSerializerInterceptor(schema))