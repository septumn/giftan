import { ObjectType, Field } from "@nestjs/graphql"

@ObjectType()
export class LogoutResponse {
  @Field(() => Boolean, { description: 'Флаг успешного завершения сессии' })
  success!: boolean;

  @Field(() => String, { nullable: true, description: 'Текст ошибки если success === false' })
  error?: string | null;
}