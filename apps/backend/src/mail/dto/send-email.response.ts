import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class SendEmailResponse {
  @Field(() => Boolean, { nullable: true })
  success?: boolean;

  @Field(() => String, { nullable: true })
  error?: string;
}