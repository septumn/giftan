import { ObjectType, Field } from "@nestjs/graphql"

@ObjectType()
export class SendEmailResponse {
  @Field(() => Boolean)
  success!: boolean

  @Field(() => String, { nullable: true })
  error?: string
}