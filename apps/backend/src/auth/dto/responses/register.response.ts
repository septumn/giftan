import { ObjectType, Field, registerEnumType, createUnionType } from '@nestjs/graphql'
import { RegistrationSuccessResponse, RegistrationErrorResponse } from '@giftan/shared/auth/registration/contract'
import { UserRole } from '@giftan/shared/common/enums/user-role.enum'

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'Роли пользователей'
})

@ObjectType()
export class RegisteredUserDto {
  @Field(() => String)
  id!: string

  @Field(() => String)
  name!: string

  @Field(() => String)
  email!: string

  @Field(() => Date, { description: 'Дата верификации почты', nullable: true })
  emailVerified!: Date

  @Field(() => UserRole, { description: 'Роль пользователя' })
  role!: UserRole
}

@ObjectType()
export class RegistrationErrorDetailsDto {
  @Field(() => String, { description: 'Код ошибки (например, EMAIL_ALREADY_EXISTS)' })
  code!: string

  @Field(() => String, { description: 'Сообщение об ошибке для пользователя' })
  message!: string
}

@ObjectType()
export class RegistrationSuccessResponseDto implements RegistrationSuccessResponse {
  @Field(() => Boolean, { description: 'Дискриминатор успеха (всегда true)' })
  success: true = true

  @Field(() => RegisteredUserDto, {
    description: 'Данные зарегистрированного пользователя'
  })
  user!: RegisteredUserDto
}

@ObjectType()
export class RegistrationErrorResponseDto implements RegistrationErrorResponse {
  @Field(() => Boolean, { description: 'Дискриминатор успеха (всегда false)' })
  success: false = false

  @Field(() => RegistrationErrorDetailsDto, {
    description: 'Объект ошибки с кодом и понятным сообщением для фронтенда'
  })
  error!: RegistrationErrorDetailsDto
}

export const RegistrationResponseDto = createUnionType({
  name: 'RegistrationResponseResult',
  types: () => [RegistrationSuccessResponseDto, RegistrationErrorResponseDto] as const,
  resolveType(value) {
    if (value.success === true) return RegistrationSuccessResponseDto
    return RegistrationErrorResponseDto
  },
})
