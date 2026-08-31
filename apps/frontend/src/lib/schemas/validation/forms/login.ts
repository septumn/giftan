import z from "zod"
import { emailValidation } from "../fields/email"

export const loginSchema = z.object({
  email: emailValidation,
  password: z.string().trim().max(32, "Пароль слишком длинный")
})

export type LoginData = z.infer<typeof loginSchema>