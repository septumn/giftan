import { InputType, Field } from '@nestjs/graphql'
import { createZodDto } from 'nestjs-zod'
import { RegistrationInputSchema } from '@giftan/shared/auth/registration/contract';

export class BaseRegisterDto extends createZodDto(RegistrationInputSchema) {}

@InputType()
export class RegisterInputDto extends BaseRegisterDto {
  @Field(() => String, { description: 'User Email' })
  email!: string;

  @Field(() => String, { description: 'User name' })
  name!: string;

  @Field(() => String, { description: 'User password' })
  password!: string;
}
