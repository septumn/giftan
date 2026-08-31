"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultResponseSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.DefaultResponseSchema = zod_1.default.object({
    success: zod_1.default.boolean(),
    error: zod_1.default.string().nullish()
});
