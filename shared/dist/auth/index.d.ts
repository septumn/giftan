import { LoginErrorExtension, LoginErrorCode } from './login';
import { RegistrationErrorExtension, RegistrationErrorCode } from './registration';
import { UpdateAccessTokenErrorExtension, UpdateAccessTokenErrorCode } from './update-access-token';
export type AuthErrorExtension<TFields extends string = string> = LoginErrorExtension<TFields> | RegistrationErrorExtension<TFields> | UpdateAccessTokenErrorExtension<TFields>;
export type AuthErrorCode = LoginErrorCode | RegistrationErrorCode | UpdateAccessTokenErrorCode;
export * from './login';
export * from './registration';
export * from './update-access-token';
//# sourceMappingURL=index.d.ts.map