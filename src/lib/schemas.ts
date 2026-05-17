import z from "zod"

export const passwordValidation = z
  .string()
  .trim()
  .min(8, "Пароль должен быть не менее 8 символов")
  .max(32, "Пароль слишком длинный")
  .regex(/[A-Z]/, "Нужна хотя бы одна заглавная буква")
  .regex(/[0-9]/, "Нужна хотя бы одна цифра")

export const emailValidation = z
  .string()
  .trim()
  .email("Неверный формат почты")
  .toLowerCase()

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6, "Введите старый пароль"),
  newPassword: passwordValidation,
})

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Имя слишком короткое"),
  email: emailValidation,
  password: passwordValidation
})

export type ChangePasswordData = z.infer<typeof changePasswordSchema>
export type RegisterData = z.infer<typeof registerSchema>