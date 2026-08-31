import z from "zod"
import { nameValidation } from "../fields/name"
import { bioValidation } from "../fields/bio"

export const updateProfileSchema = z.object({
  name: nameValidation,
  bio: bioValidation
})

export type UpdateProfileData = z.infer<typeof updateProfileSchema>