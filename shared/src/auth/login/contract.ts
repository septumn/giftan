import { z } from 'zod';

export const LoginInputSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Введите email')
    .max(254, 'Email слишком длинный')
    .email('Неверный формат почты')
    .toLowerCase(),
  password: z
    .string()
    .min(1, 'Введите пароль'),
});

export const LoginResponseSchema = z.object({
  success: z.boolean(),
  accessToken: z.string().nullish(),
  error: z.string().nullish()
});

export type LoginInput = z.infer<typeof LoginInputSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;