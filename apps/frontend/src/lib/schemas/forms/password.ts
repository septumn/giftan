import z from "zod"

export const passwordValidation = z
  .string()
  .trim()
  .min(8, "Пароль должен быть не менее 8 символов")
  .max(32, "Пароль слишком длинный")
  .regex(/[A-Z]/, "Нужна хотя бы одна заглавная буква")
  .regex(/[0-9]/, "Нужна хотя бы одна цифра")