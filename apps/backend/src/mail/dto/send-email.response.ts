<<<<<<< HEAD
import { ObjectType, Field } from "@nestjs/graphql"

@ObjectType()
export class SendEmailResponse {
  @Field(() => Boolean)
  success!: boolean

  @Field(() => String, { nullable: true })
  error?: string
=======
import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class SendEmailResponse {
  @Field(() => Boolean, { nullable: true })
  success?: boolean;

  @Field(() => String, { nullable: true })
  error?: string;
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
}