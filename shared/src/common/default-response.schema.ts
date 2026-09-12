import z from 'zod'

export const DefaultResponseSchema = z.object({
  success: z.boolean(),
  error: z.string().nullish()
})