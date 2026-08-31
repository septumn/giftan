<<<<<<< HEAD
import { InputType, Field } from '@nestjs/graphql'
import { LoginInput } from '@giftan/contracts'

@InputType()
export class LoginInputDto implements LoginInput {
  @Field(() => String)
  email!: string;

  @Field(() => String)
=======
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field()
  email!: string;

  @Field()
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
  password!: string;
}