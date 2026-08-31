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
        
        try {
          const safeSchema = this.schema instanceof z.ZodObject 
            ? this.schema.passthrough() 
            : this.schema;

          return safeSchema.parse(data)
        } catch (error) {
          console.error('⚠️ [ZOD SERIALIZER INTERCEPTOR WARNING]:', error)
          return data
        }
      })
    )
  }
}