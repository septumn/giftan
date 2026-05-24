import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

@InputType()
export class RegisterInput {
  @Field(() => String)
  @IsEmail({}, { message: 'Некорректный формат Email' })
  @IsNotEmpty({ message: 'Email не может быть пустым' })
  email!: string;

  @Field(() => String)
  @IsString({ message: 'Имя должно быть строкой' })
  @Length(2, 25, { message: 'Имя должно быть от 2 до 25 символов' })
  @IsNotEmpty({ message: 'Имя не может быть пустым' })
  name!: string;

  @Field(() => String)
  @IsString({ message: 'Пароль должен быть строкой' })
  @Length(8, 32, { message: 'Пароль должен быть от 8 до 32 символов' })
  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  password!: string;
}