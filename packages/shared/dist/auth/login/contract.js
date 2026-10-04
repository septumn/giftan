"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginResponseSchema = exports.LoginInputSchema = void 0;
const zod_1 = require("zod");
exports.LoginInputSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .trim()
        .min(1, 'Введите email')
        .max(254, 'Email слишком длинный')
        .email('Неверный формат почты')
        .toLowerCase(),
    password: zod_1.z
        .string()
        .min(1, 'Введите пароль'),
});
exports.LoginResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    accessToken: zod_1.z.string().nullish(),
    error: zod_1.z.string().nullish()
});
