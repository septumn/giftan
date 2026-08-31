import z from "zod"

export const emailValidation = z
  .string()
  .trim()
  .max(254, "Email слишком длинный")
  .email("Неверный формат почты")
  .min(3)
  .toLowerCase()