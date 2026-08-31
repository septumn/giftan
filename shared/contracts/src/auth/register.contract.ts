import z from 'zod'
import { DefaultResponseSchema } from '../common/default-response.schema'

export const RegisterInputSchema = z.object({
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

export const RegisterResponseSchema = DefaultResponseSchema

export type RegisterInput = z.infer<typeof RegisterInputSchema>
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>