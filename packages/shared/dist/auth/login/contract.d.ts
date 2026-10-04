import { z } from 'zod';
export declare const LoginInputSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const LoginResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    accessToken: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    error: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    success: boolean;
    accessToken?: string | null | undefined;
    error?: string | null | undefined;
}, {
    success: boolean;
    accessToken?: string | null | undefined;
    error?: string | null | undefined;
}>;
export type LoginInput = z.infer<typeof LoginInputSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
//# sourceMappingURL=contract.d.ts.map