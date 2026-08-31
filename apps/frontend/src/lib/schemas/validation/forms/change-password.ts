import z from "zod"
import { passwordValidation } from "../fields/password"

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6, "Введите старый пароль"),
  newPassword: passwordValidation,
})

export type ChangePasswordData = z.infer<typeof changePasswordSchema>