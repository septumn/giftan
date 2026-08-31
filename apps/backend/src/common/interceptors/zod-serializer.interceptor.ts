import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { z } from 'zod'

@Injectable()
export class ZodSerializerInterceptor implements NestInterceptor {
  constructor(private schema: z.ZodSchema) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data === null || data === undefined) return data
        
        return this.schema.parse(data)
      })
    )
  }
}