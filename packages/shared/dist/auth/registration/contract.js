"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationResponseSchema = exports.RegistrationErrorResponseSchema = exports.RegistrationSuccessResponseSchema = exports.RegistrationInputSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_role_enum_1 = require("../../common/enums/user-role.enum");
exports.RegistrationInputSchema = zod_1.default.object({
    name: zod_1.default.string()
        .trim()
        .min(2, "Имя должно быть от 2 до 25 символов")
        .max(25, "Имя должно быть от 2 до 25 символов")
        .regex(/^[a-zA-Z0-9а-яА-ЯёЁ_]+$/, "Разрешены только буквы, цифры и нижнее подчеркивание"),
    email: zod_1.default.string()
        .trim()
        .max(254, "Email слишком длинный")
        .email("Неверный формат почты")
        .min(3)
        .toLowerCase(),
    password: zod_1.default.string()
        .trim()
        .min(8, "Пароль должен быть не менее 8 символов")
        .max(32, "Пароль слишком длинный")
        .regex(/[A-Z]/, "Нужна хотя бы одна заглавная буква")
        .regex(/[0-9]/, "Нужна хотя бы одна цифра")
});
exports.RegistrationSuccessResponseSchema = zod_1.default.object({
    success: zod_1.default.literal(true),
    user: zod_1.default.object({
        id: zod_1.default.string(),
        name: zod_1.default.string(),
        email: zod_1.default.string(),
        emailVerified: zod_1.default.date(),
        role: zod_1.default.nativeEnum(user_role_enum_1.UserRole)
    })
});
exports.RegistrationErrorResponseSchema = zod_1.default.object({
    success: zod_1.default.literal(false),
    error: zod_1.default.object({
        code: zod_1.default.string(),
        message: zod_1.default.string()
    })
});
exports.RegistrationResponseSchema = zod_1.default.discriminatedUnion('success', [
    exports.RegistrationSuccessResponseSchema,
    exports.RegistrationErrorResponseSchema
]);
