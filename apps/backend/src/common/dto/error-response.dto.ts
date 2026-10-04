import { ObjectType, Field } from '@nestjs/graphql'
import { DefaultErrorResponse, DefaultErrorDetails } from '@giftan/shared/common/error/contract'

@ObjectType()
export class DefaultErrorDetailsDto implements DefaultErrorDetails {
  @Field(() => String, { description: 'Код ошибки (например NOT_FOUND)' })
  code!: string

  @Field(() => String, { description: 'Человекопонятный текст ошибки для пользователя' })
  message!: string
}

@ObjectType()
export class DefaultErrorResponseDto implements DefaultErrorResponse {
  @Field(() => Boolean, { description: 'Дискриминатор успеха (всегда false)' })
  success: false = false

  @Field(() => DefaultErrorDetailsDto, { description: 'Объект с деталями ошибки' })
  error!: DefaultErrorDetailsDto
}