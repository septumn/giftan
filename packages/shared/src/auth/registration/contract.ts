import z from 'zod'
import { UserRole } from '../../common/enums/user-role.enum'

export const RegistrationInputSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Имя должно быть от 2 до 25 символов")
    .max(25, "Имя должно быть от 2 до 25 символов")
    .regex(/^[a-zA-Z0-9а-яА-ЯёЁ_]+$/, "Разрешены только буквы, цифры и нижнее подчеркивание"),
  email: z.string()
    .trim()
    .max(254, "Email слишком длинный")
    .email("Неверный формат почты")
    .min(3)
    .toLowerCase(),
  password: z.string()
    .trim()
    .min(8, "Пароль должен быть не менее 8 символов")
    .max(32, "Пароль слишком длинный")
    .regex(/[A-Z]/, "Нужна хотя бы одна заглавная буква")
    .regex(/[0-9]/, "Нужна хотя бы одна цифра")
})

export const RegistrationSuccessResponseSchema = z.object({
  success: z.literal(true),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    emailVerified: z.date(),
    role: z.nativeEnum(UserRole)
  })
})

export const RegistrationErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string()
  })
})

export const RegistrationResponseSchema = z.discriminatedUnion('success', [
  RegistrationSuccessResponseSchema,
  RegistrationErrorResponseSchema
])

export type RegistrationSuccessResponse = z.infer<typeof RegistrationSuccessResponseSchema>
export type RegistrationErrorResponse = z.infer<typeof RegistrationErrorResponseSchema>
export type RegistrationInput = z.infer<typeof RegistrationInputSchema>
export type RegistrationResponse = z.infer<typeof RegistrationResponseSchema>