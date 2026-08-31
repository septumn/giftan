import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class VerifyEmailResponse {
  @Field(() => Boolean)
  success!: boolean

  @Field(() => String, { nullable: true })
  emailVerified!: string | null

  @Field(() => String, { nullable: true })
  error?: string
}