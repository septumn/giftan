import z from 'zod';
export declare const DefaultErrorDetailsSchema: z.ZodObject<{
    code: z.ZodString;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    code: string;
    message: string;
}, {
    code: string;
    message: string;
}>;
export declare const DefaultErrorResponseSchema: z.ZodObject<{
    success: z.ZodLiteral<false>;
    error: z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
    }, {
        code: string;
        message: string;
    }>;
}, "strip", z.ZodTypeAny, {
    success: false;
    error: {
        code: string;
        message: string;
    };
}, {
    success: false;
    error: {
        code: string;
        message: string;
    };
}>;
export type DefaultErrorDetails = z.infer<typeof DefaultErrorDetailsSchema>;
export type DefaultErrorResponse = z.infer<typeof DefaultErrorResponseSchema>;
//# sourceMappingURL=contract.d.ts.map