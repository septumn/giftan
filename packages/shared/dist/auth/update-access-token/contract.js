"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAccessTokenResponseSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const errors_1 = require("./errors");
const errorCodeValues = Object.values(errors_1.UpdateAccessTokenErrorCode);
const UpdateAccessTokenSuccessSchema = zod_1.default.object({
    success: zod_1.default.literal(true),
    accessToken: zod_1.default.string(),
});
const UpdateAccessTokenErrorSchema = zod_1.default.object({
    success: zod_1.default.literal(false),
    errorCode: zod_1.default.enum(errorCodeValues),
});
exports.UpdateAccessTokenResponseSchema = zod_1.default.discriminatedUnion('success', [
    UpdateAccessTokenSuccessSchema,
    UpdateAccessTokenErrorSchema,
]);
