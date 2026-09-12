import z from 'zod';
export declare const UpdateAccessTokenResponseSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    success: z.ZodLiteral<true>;
    accessToken: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    success: z.ZodLiteral<false>;
    errorCode: z.ZodEnum<{
        USER_NOT_FOUND: "USER_NOT_FOUND";
        INVALID_REFRESH_TOKEN: "INVALID_REFRESH_TOKEN";
        REFRESH_TOKEN_EXPIRED: "REFRESH_TOKEN_EXPIRED";
        REFRESH_TOKEN_REVOKED: "REFRESH_TOKEN_REVOKED";
    }>;
}, z.core.$strip>], "success">;
export type UpdateAccessTokenResponse = z.infer<typeof UpdateAccessTokenResponseSchema>;
//# sourceMappingURL=contract.d.ts.map