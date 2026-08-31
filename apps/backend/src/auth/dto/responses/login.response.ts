import { ObjectType, Field } from '@nestjs/graphql'
import { LoginResponse } from '@giftan/contracts'
import GraphQLJSON from 'graphql-type-json'

@ObjectType()
export class LoginResponseDto implements LoginResponse {
  @Field(() => Boolean)
  success!: boolean

  @Field(() => String, { nullable: true })
  error?: string

  @Field(() => String, { nullable: true })
  accessToken?: string
}