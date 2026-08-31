import z from 'zod';
export declare const RegisterInputSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const RegisterResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    error: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type RegisterInputDto = z.infer<typeof RegisterInputSchema>;
export type RegisterResponseDto = z.infer<typeof RegisterResponseSchema>;
//# sourceMappingURL=register.contract.d.ts.map