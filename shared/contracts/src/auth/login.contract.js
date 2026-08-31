"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginResponseSchema = exports.LoginInputSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const default_response_schema_1 = require("../common/default-response.schema");
exports.LoginInputSchema = zod_1.default.object({
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
exports.LoginResponseSchema = default_response_schema_1.DefaultResponseSchema;
//# sourceMappingURL=login.contract.js.map