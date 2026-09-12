import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class VerifyResponse {
  @Field(() => Boolean, { description: 'Флаг успешной верификации' })
  success!: boolean;

  @Field(() => Date, { nullable: true, description: 'Дата успешной верификации' })
  emailVerified!: Date | null;
}