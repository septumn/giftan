import { InputType, Field } from '@nestjs/graphql'
import { RegistrationInput } from '@giftan/shared/auth/registration/contract'

@InputType()
export class RegisterInputDto implements RegistrationInput {
  @Field(() => String, { description: 'User Email' })
  email!: string;

  @Field(() => String, { description: 'User name' })
  name!: string;

  @Field(() => String, { description: 'User password' })
  password!: string;
}