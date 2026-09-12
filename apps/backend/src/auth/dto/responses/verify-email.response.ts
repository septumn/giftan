import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class VerifyEmailResponse {
  @Field(() => Boolean, { description: 'Флаг успешной верификации email' })
  success!: boolean

  @Field(() => String, {
    nullable: true,
    description: 'Дата успешной верификации'
  })
  emailVerified!: string | null

  @Field(() => String, {
    nullable: true,
    description: 'Текст ошибки, если success === false'
  })
  error?: string
}