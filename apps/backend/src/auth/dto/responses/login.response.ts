import { ObjectType, Field } from '@nestjs/graphql'
import { LoginResponse } from '@giftan/shared/auth/login/contract'

@ObjectType()
export class LoginResponseDto implements LoginResponse {
  @Field(() => Boolean, { description: 'Флаг успешного завершения сессии' })
  success!: boolean

  @Field(() => String, { nullable: true, description: 'Текст ошибки если success === false' })
  error?: string | null

  @Field(() => String, { nullable: true, description: 'Токен доступа' })
  accessToken?: string
}