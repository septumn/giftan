import { ObjectType, Field } from "@nestjs/graphql"

@ObjectType()
export class LogoutResponse {
  @Field(() => Boolean, { description: 'Флаг успешного заверешния сессии' })
  success!: boolean;
}