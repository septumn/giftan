import { ObjectType, Field } from '@nestjs/graphql'
import { UpdateAccessTokenResponse } from '@giftan/contracts'

@ObjectType()
export class UpdateAccessTokenResponseDto implements UpdateAccessTokenResponse {
  @Field(() => Boolean)
  success!: boolean

  @Field(() => String, { nullable: true })
  accessToken?: string

  @Field(() => String, { nullable: true })
  error?: string
}