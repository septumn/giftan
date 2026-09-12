import { z } from 'zod';
export declare const LoginInputSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const LoginResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    accessToken: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type LoginInput = z.infer<typeof LoginInputSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
//# sourceMappingURL=contract.d.ts.map