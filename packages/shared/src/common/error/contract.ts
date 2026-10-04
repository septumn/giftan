import z from 'zod'

export const DefaultErrorDetailsSchema = z.object({
  code: z.string(),
  message: z.string()
})

export const DefaultErrorResponseSchema = z.object({
  success: z.literal(false),
  error: DefaultErrorDetailsSchema
})

export type DefaultErrorDetails = z.infer<typeof DefaultErrorDetailsSchema>
export type DefaultErrorResponse = z.infer<typeof DefaultErrorResponseSchema>