import z from 'zod';
export declare const RegistrationInputSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const RegistrationResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    error: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type RegistrationInput = z.infer<typeof RegistrationInputSchema>;
export type RegistrationResponse = z.infer<typeof RegistrationResponseSchema>;
//# sourceMappingURL=contract.d.ts.map