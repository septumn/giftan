import { InputType, Field } from '@nestjs/graphql'
import { LoginInput } from '@giftan/contracts'

@InputType()
export class LoginInputDto implements LoginInput {
  @Field(() => String)
  email!: string;

  @Field(() => String)
  password!: string;
}