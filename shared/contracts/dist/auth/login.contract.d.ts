import z from 'zod';
export declare const LoginInputSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const LoginResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    error: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type LoginInputDto = z.infer<typeof LoginInputSchema>;
export type LoginResponseDto = z.infer<typeof LoginResponseSchema>;
//# sourceMappingURL=login.contract.d.ts.map