import z from "zod"

export const updateProfileResponseSchema = z.object({
  updateProfile: z.object({
    id: z.string(),
    name: z.string(),
    bio: z.string().nullable().optional()
  })
})

export type UpdateProfileResponse = z.infer<typeof updateProfileResponseSchema>