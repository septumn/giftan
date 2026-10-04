  import z from 'zod';
  import { UpdateAccessTokenErrorCode } from './errors';

  const errorCodeValues = Object.values(UpdateAccessTokenErrorCode) as [
    UpdateAccessTokenErrorCode,
    ...UpdateAccessTokenErrorCode[]
  ];

  const UpdateAccessTokenSuccessSchema = z.object({
    success: z.literal(true),
    accessToken: z.string(),
  });

  const UpdateAccessTokenErrorSchema = z.object({
    success: z.literal(false),
    errorCode: z.enum(errorCodeValues),
  });

  export const UpdateAccessTokenResponseSchema = z.discriminatedUnion('success', [
    UpdateAccessTokenSuccessSchema,
    UpdateAccessTokenErrorSchema,
  ]);

  export type UpdateAccessTokenResponse = z.infer<typeof UpdateAccessTokenResponseSchema>;