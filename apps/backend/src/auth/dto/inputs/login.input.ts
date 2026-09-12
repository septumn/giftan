import { InputType, Field } from '@nestjs/graphql'
import { LoginInput } from '@giftan/shared/auth/login/contract'

@InputType()
export class LoginInputDto implements LoginInput {
  @Field(() => String, { description: 'User Email' })
  email!: string;

  @Field(() => String, { description: 'User password' })
  password!: string;
}