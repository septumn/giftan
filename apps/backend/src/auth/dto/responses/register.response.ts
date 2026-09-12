import { ObjectType, Field } from '@nestjs/graphql'
import { RegistrationResponse } from '@giftan/shared/auth/registration/contract'
import GraphQLJSON from 'graphql-type-json'

@ObjectType()
export class RegisterResponseDto implements RegistrationResponse {
  @Field(() => Boolean, { description: 'Successful registration flag' })
  success!: boolean

  @Field(() => GraphQLJSON, {
    nullable: true,
    description: 'Данные зарегистрированного пользователя (ID, email и основные профильные данные)'
  })
  user?: any

  @Field(() => String, {
    nullable: true,
    description: 'Текст ошибки, если success === false'
  })
  error?: string | null
}