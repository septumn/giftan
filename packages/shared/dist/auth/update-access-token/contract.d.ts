import z from 'zod';
import { UpdateAccessTokenErrorCode } from './errors';
export declare const UpdateAccessTokenResponseSchema: z.ZodDiscriminatedUnion<"success", [z.ZodObject<{
    success: z.ZodLiteral<true>;
    accessToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    success: true;
    accessToken: string;
}, {
    success: true;
    accessToken: string;
}>, z.ZodObject<{
    success: z.ZodLiteral<false>;
    errorCode: z.ZodEnum<[UpdateAccessTokenErrorCode, ...UpdateAccessTokenErrorCode[]]>;
}, "strip", z.ZodTypeAny, {
    success: false;
    errorCode: UpdateAccessTokenErrorCode;
}, {
    success: false;
    errorCode: UpdateAccessTokenErrorCode;
}>]>;
export type UpdateAccessTokenResponse = z.infer<typeof UpdateAccessTokenResponseSchema>;
//# sourceMappingURL=contract.d.ts.map