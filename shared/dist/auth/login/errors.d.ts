export declare const LoginErrorCode: {
    readonly INVALID_CREDENTIALS: "INVALID_CREDENTIALS";
    readonly USER_NOT_FOUND: "USER_NOT_FOUND";
    readonly ACCOUNT_BLOCKED: "ACCOUNT_BLOCKED";
    readonly EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED";
    readonly TOO_MANY_ATTEMPTS: "TOO_MANY_ATTEMPTS";
};
export type LoginErrorCode = (typeof LoginErrorCode)[keyof typeof LoginErrorCode];
export interface LoginErrorExtension<TFields extends string = string> {
    code: LoginErrorCode;
    action: 'LOGIN';
    field?: TFields;
    fields?: readonly TFields[];
}
//# sourceMappingURL=errors.d.ts.map