import { InputType, Field } from '@nestjs/graphql'
import { IsOptional, IsString, Length, Matches } from 'class-validator'

@InputType({ description: 'Входные данные для обновления профиля пользователя' })
export class UpdateProfileInput {
  
<<<<<<< HEAD
  @Field(() => String, { nullable: true, description: 'Отображаемое имя пользователя' })
=======
  @Field({ nullable: true, description: 'Отображаемое имя пользователя' })
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
  @IsOptional()
  @IsString({ message: 'Имя должно быть строкой' })
  @Length(2, 25, { message: 'Имя должно быть от 2 до 25 символов' })
  @Matches(/^[a-zA-Z0-9а-яА-ЯёЁ\s-_]+$/, {
    message: 'Имя может содержать только буквы, цифры, пробелы, дефисы и подчеркивания',
  })
  name?: string;

<<<<<<< HEAD
  @Field(() => String, { nullable: true, description: 'Краткая биография (о себе)' })
  @IsOptional()
  @IsString({ message: 'Биография должна быть строкой' })
  @Length(1, 160, { message: 'Биография не должна превышать 160 символов' }) 
=======
  @Field({ nullable: true, description: 'Краткая биография (о себе)' })
  @IsOptional()
  @IsString({ message: 'Биография должна быть строкой' })
  @Length(0, 160, { message: 'Биография не должна превышать 160 символов' })
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
  bio?: string;
}