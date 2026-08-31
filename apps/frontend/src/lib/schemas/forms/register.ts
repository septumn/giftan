import z from "zod"
import { emailValidation } from "./email"
import { passwordValidation } from "./password"

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Имя слишком короткое"),
  email: emailValidation,
  password: passwordValidation
})

export type RegisterData = z.infer<typeof registerSchema>