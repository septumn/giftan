import { ObjectType, Field } from "@nestjs/graphql"

@ObjectType()
export class LogoutResponse {
<<<<<<< HEAD
  @Field(() => Boolean, { description: 'Флаг успешного завершения сессии' })
  success!: boolean;

  @Field(() => String, { nullable: true, description: 'Текст ошибки, если success равен false' })
  error?: string | null;
=======
  @Field(() => Boolean, { description: 'Флаг успешного заверешния сессии' })
  success!: boolean;
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
}