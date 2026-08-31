"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResponseSchema = exports.BaseUserSchema = void 0;
const zod_1 = require("zod");
const IsoDateSchema = zod_1.z.union([zod_1.z.string(), zod_1.z.date()]).transform((val) => val instanceof Date ? val.toISOString() : val);
exports.BaseUserSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Некорректный ID'),
    name: zod_1.z.string()
        .trim()
        .min(2, "Имя должно быть от 2 до 25 символов")
        .max(25, "Имя должно быть от 2 до 25 символов")
        .regex(/^[a-zA-Z0-9а-яА-ЯёЁ_]+$/, "Разрешены только буквы, цифры и нижнее подчеркивание"),
    password: zod_1.z.string()
        .trim()
        .min(8, "Пароль должен быть не менее 8 символов")
        .max(32, "Пароль слишком длинный")
        .regex(/[A-Z]/, "Нужна хотя бы одна заглавная буква")
        .regex(/[0-9]/, "Нужна хотя бы одна цифра"),
    email: zod_1.z.string()
        .trim()
        .max(254, "Email слишком длинный")
        .email("Неверный формат почты")
        .min(3)
        .toLowerCase(),
    emailVerified: IsoDateSchema.nullable(),
    bio: zod_1.z.string()
        .trim()
        .max(160, { message: "Биография не должна превышать 160 символов" })
        .optional()
        .or(zod_1.z.literal('')),
    confirmationSentAt: IsoDateSchema.nullable(),
    image: zod_1.z.string().nullable(),
    role: zod_1.z.enum(['USER', 'MODERATOR', 'ADMIN']).default('USER'),
    isBlocked: zod_1.z.boolean().default(false),
    createdAt: IsoDateSchema,
    updatedAt: IsoDateSchema,
});
exports.UserResponseSchema = exports.BaseUserSchema.omit({ password: true });
//# sourceMappingURL=user.js.map