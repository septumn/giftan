import { z } from 'zod';
export declare const BaseUserSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    password: z.ZodString;
    email: z.ZodString;
    emailVerified: z.ZodNullable<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodDate]>, z.ZodTransform<string, string | Date>>>;
    bio: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    confirmationSentAt: z.ZodNullable<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodDate]>, z.ZodTransform<string, string | Date>>>;
    image: z.ZodNullable<z.ZodString>;
    role: z.ZodDefault<z.ZodEnum<{
        USER: "USER";
        MODERATOR: "MODERATOR";
        ADMIN: "ADMIN";
    }>>;
    isBlocked: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodDate]>, z.ZodTransform<string, string | Date>>;
    updatedAt: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodDate]>, z.ZodTransform<string, string | Date>>;
}, z.core.$strip>;
export type User = z.infer<typeof BaseUserSchema>;
export declare const UserResponseSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    name: z.ZodString;
    createdAt: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodDate]>, z.ZodTransform<string, string | Date>>;
    updatedAt: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodDate]>, z.ZodTransform<string, string | Date>>;
    emailVerified: z.ZodNullable<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodDate]>, z.ZodTransform<string, string | Date>>>;
    bio: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    confirmationSentAt: z.ZodNullable<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodDate]>, z.ZodTransform<string, string | Date>>>;
    image: z.ZodNullable<z.ZodString>;
    role: z.ZodDefault<z.ZodEnum<{
        USER: "USER";
        MODERATOR: "MODERATOR";
        ADMIN: "ADMIN";
    }>>;
    isBlocked: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
//# sourceMappingURL=user.d.ts.map