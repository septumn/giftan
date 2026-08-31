import { z } from 'zod'

const IsoDateSchema = z.union([z.string(), z.date()]).transform((val) =>
  val instanceof Date ? val.toISOString() : val
)

export const BaseUserSchema = z.object({
  id: z.string().uuid('Некорректный ID'),
  name: z.string()
    .trim()
    .min(2, "Имя должно быть от 2 до 25 символов")
    .max(25, "Имя должно быть от 2 до 25 символов")
    .regex(/^[a-zA-Z0-9а-яА-ЯёЁ_]+$/, "Разрешены только буквы, цифры и нижнее подчеркивание"),
  password: z.string()
    .trim()
    .min(8, "Пароль должен быть не менее 8 символов")
    .max(32, "Пароль слишком длинный")
    .regex(/[A-Z]/, "Нужна хотя бы одна заглавная буква")
    .regex(/[0-9]/, "Нужна хотя бы одна цифра"),
  email: z.string()
    .trim()
    .max(254, "Email слишком длинный")
    .email("Неверный формат почты")
    .min(3)
    .toLowerCase(),
  emailVerified: IsoDateSchema.nullable(),
  bio: z.string()
    .trim()
    .max(160, { message: "Биография не должна превышать 160 символов" })
    .optional()
    .or(z.literal('')),
  confirmationSentAt: IsoDateSchema.nullable(),
  image: z.string().nullable(),
  role: z.enum(['USER', 'MODERATOR', 'ADMIN']).default('USER'),
  isBlocked: z.boolean().default(false),
  createdAt: IsoDateSchema,
  updatedAt: IsoDateSchema,
})

export type User = z.infer<typeof BaseUserSchema>

export const UserResponseSchema = BaseUserSchema.omit({ password: true })
export type UserResponse = z.infer<typeof UserResponseSchema>