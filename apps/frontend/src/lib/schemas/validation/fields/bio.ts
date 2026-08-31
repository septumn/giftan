import z from "zod"

export const bioValidation = z
  .string()
  .trim()
  .max(160, { message: "Биография не должна превышать 160 символов" })
  .optional()
  .or(z.literal(''))