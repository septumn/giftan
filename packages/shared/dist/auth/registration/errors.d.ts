export declare const RegistrationErrorCode: {
    readonly EMAIL_ALREADY_EXISTS: "EMAIL_ALREADY_EXISTS";
    readonly NAME_ALREADY_EXISTS: "NAME_ALREADY_EXISTS";
    readonly NAME_AND_EMAIL_TAKEN: "NAME_AND_EMAIL_TAKEN";
};
export type RegistrationErrorCode = (typeof RegistrationErrorCode)[keyof typeof RegistrationErrorCode];
export interface RegistrationErrorExtension<TFields extends string = string> {
    code: RegistrationErrorCode;
    action: 'REGISTRATION';
    field?: TFields;
    fields?: readonly TFields[];
}
//# sourceMappingURL=errors.d.ts.map