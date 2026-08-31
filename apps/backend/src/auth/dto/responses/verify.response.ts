import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class VerifyResponse {
  @Field(() => Boolean)
  success!: boolean;

  @Field(() => Date, { nullable: true })
  emailVerified!: Date | null; 
}