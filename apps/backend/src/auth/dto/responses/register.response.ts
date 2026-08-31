import { ObjectType, Field } from '@nestjs/graphql'
import { RegisterResponse } from '@giftan/contracts'
import GraphQLJSON from 'graphql-type-json'

@ObjectType()
export class RegisterResponseDto implements RegisterResponse {
  @Field(() => Boolean)
  success!: boolean

  @Field(() => GraphQLJSON, { nullable: true })
  user?: any

  @Field(() => String, { nullable: true })
  error?: string
}