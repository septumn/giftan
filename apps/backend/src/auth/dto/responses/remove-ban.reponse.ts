import { ObjectType, Field } from "@nestjs/graphql"

@ObjectType()
export class RemoveBanResponse {
  @Field(() => Boolean, { description: 'Флаг успешного снятия бана' })
  success!: boolean

  @Field(() => String, {
    nullable: true,
    description: 'Текст ошибки, если success === false'
  })
  error?: string | null
}