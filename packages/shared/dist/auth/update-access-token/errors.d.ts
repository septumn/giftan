export declare const UpdateAccessTokenErrorCode: {
    readonly INVALID_REFRESH_TOKEN: "INVALID_REFRESH_TOKEN";
    readonly REFRESH_TOKEN_EXPIRED: "REFRESH_TOKEN_EXPIRED";
    readonly REFRESH_TOKEN_REVOKED: "REFRESH_TOKEN_REVOKED";
    readonly USER_NOT_FOUND: "USER_NOT_FOUND";
};
export type UpdateAccessTokenErrorCode = (typeof UpdateAccessTokenErrorCode)[keyof typeof UpdateAccessTokenErrorCode];
export interface UpdateAccessTokenErrorExtension<TFields extends string = string> {
    code: UpdateAccessTokenErrorCode;
    action: 'UPDATE_ACCESS_TOKEN';
    field?: TFields;
    fields?: readonly TFields[];
}
//# sourceMappingURL=errors.d.ts.map