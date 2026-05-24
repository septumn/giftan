import { InputType, Field } from '@nestjs/graphql'
import { IsOptional, IsString, Length, Matches } from 'class-validator'

@InputType({ description: 'Входные данные для обновления профиля пользователя' })
export class UpdateProfileInput {
  
  @Field({ nullable: true, description: 'Отображаемое имя пользователя' })
  @IsOptional()
  @IsString({ message: 'Имя должно быть строкой' })
  @Length(2, 25, { message: 'Имя должно быть от 2 до 25 символов' })
  @Matches(/^[a-zA-Z0-9а-яА-ЯёЁ\s-_]+$/, {
    message: 'Имя может содержать только буквы, цифры, пробелы, дефисы и подчеркивания',
  })
  name?: string;

  @Field({ nullable: true, description: 'Краткая биография (о себе)' })
  @IsOptional()
  @IsString({ message: 'Биография должна быть строкой' })
  @Length(0, 160, { message: 'Биография не должна превышать 160 символов' })
  bio?: string;
}