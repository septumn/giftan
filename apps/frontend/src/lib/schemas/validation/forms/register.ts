import z from "zod"
import { nameValidation } from "../fields/name"
import { emailValidation } from "../fields/email"
import { passwordValidation } from "../fields/password"

export const registerSchema = z.object({
  name: nameValidation,
  email: emailValidation,
  password: passwordValidation
})

export type RegisterData = z.infer<typeof registerSchema>