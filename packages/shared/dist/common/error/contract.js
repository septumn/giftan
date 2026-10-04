"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultErrorResponseSchema = exports.DefaultErrorDetailsSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.DefaultErrorDetailsSchema = zod_1.default.object({
    code: zod_1.default.string(),
    message: zod_1.default.string()
});
exports.DefaultErrorResponseSchema = zod_1.default.object({
    success: zod_1.default.literal(false),
    error: exports.DefaultErrorDetailsSchema
});
