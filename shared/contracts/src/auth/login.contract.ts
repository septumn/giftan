import z from 'zod'

export const LoginInputSchema = z.object({
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
    .refine((val) => /[A-Z]/.test(val), {
      message: "Нужна хотя бы одна заглавная буква",
    })
    .regex(/[0-9]/, "Нужна хотя бы одна цифра")
})

export const LoginResponseSchema = z.object({
  success: z.boolean(),
  error: z.string().nullable().optional(),
  accessToken: z.string().nullable().optional()
})

export type LoginInput = z.infer<typeof LoginInputSchema>
export type LoginResponse = z.infer<typeof LoginResponseSchema>