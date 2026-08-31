import z from 'zod'

export const UpdateAccessTokenResponseSchema = z.object({
  success: z.boolean(),
  accessToken: z.string().nullish(),
  error: z.string().nullish()
})

export type UpdateAccessTokenResponse = z.infer<typeof UpdateAccessTokenResponseSchema>