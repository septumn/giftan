import z from 'zod';
import { UserRole } from '../../common/enums/user-role.enum';
export declare const RegistrationInputSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name: string;
}, {
    email: string;
    password: string;
    name: string;
}>;
export declare const RegistrationSuccessResponseSchema: z.ZodObject<{
    success: z.ZodLiteral<true>;
    user: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
        emailVerified: z.ZodDate;
        role: z.ZodNativeEnum<typeof UserRole>;
    }, "strip", z.ZodTypeAny, {
        email: string;
        name: string;
        id: string;
        emailVerified: Date;
        role: UserRole;
    }, {
        email: string;
        name: string;
        id: string;
        emailVerified: Date;
        role: UserRole;
    }>;
}, "strip", z.ZodTypeAny, {
    success: true;
    user: {
        email: string;
        name: string;
        id: string;
        emailVerified: Date;
        role: UserRole;
    };
}, {
    success: true;
    user: {
        email: string;
        name: string;
        id: string;
        emailVerified: Date;
        role: UserRole;
    };
}>;
export declare const RegistrationErrorResponseSchema: z.ZodObject<{
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
export declare const RegistrationResponseSchema: z.ZodDiscriminatedUnion<"success", [z.ZodObject<{
    success: z.ZodLiteral<true>;
    user: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
        emailVerified: z.ZodDate;
        role: z.ZodNativeEnum<typeof UserRole>;
    }, "strip", z.ZodTypeAny, {
        email: string;
        name: string;
        id: string;
        emailVerified: Date;
        role: UserRole;
    }, {
        email: string;
        name: string;
        id: string;
        emailVerified: Date;
        role: UserRole;
    }>;
}, "strip", z.ZodTypeAny, {
    success: true;
    user: {
        email: string;
        name: string;
        id: string;
        emailVerified: Date;
        role: UserRole;
    };
}, {
    success: true;
    user: {
        email: string;
        name: string;
        id: string;
        emailVerified: Date;
        role: UserRole;
    };
}>, z.ZodObject<{
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
}>]>;
export type RegistrationSuccessResponse = z.infer<typeof RegistrationSuccessResponseSchema>;
export type RegistrationErrorResponse = z.infer<typeof RegistrationErrorResponseSchema>;
export type RegistrationInput = z.infer<typeof RegistrationInputSchema>;
export type RegistrationResponse = z.infer<typeof RegistrationResponseSchema>;
//# sourceMappingURL=contract.d.ts.map