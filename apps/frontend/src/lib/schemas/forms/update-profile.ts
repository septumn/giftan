import z from "zod"

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Имя должно быть от 2 до 25 символов" })
    .max(25, { message: "Имя должно быть от 2 до 25 символов" })
    .regex(/^[a-zA-Z0-9а-яА-ЯёЁ\s-_]+$/, {
      message: "Имя может содержать только буквы, цифры, пробелы, дефисы и подчеркивания",
    }),
  bio: z
    .string()
    .trim()
    .max(160, { message: "Биография не должна превышать 160 символов" })
    .optional()
    .or(z.literal('')), 
})

export type UpdateProfileData = z.infer<typeof updateProfileSchema>