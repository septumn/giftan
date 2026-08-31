import { InputType, Field } from '@nestjs/graphql'
import { RegisterInput } from '@giftan/contracts'

@InputType()
export class RegisterInputDto implements RegisterInput {
  @Field(() => String, { description: 'Email пользователя' })
  email!: string;

  @Field(() => String, { description: 'Имя пользователя' })
  name!: string;

  @Field(() => String, { description: 'Пароль пользователя' })
  password!: string;
}