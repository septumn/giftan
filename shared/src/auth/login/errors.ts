export const LoginErrorCode = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  ACCOUNT_BLOCKED: 'ACCOUNT_BLOCKED',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  TOO_MANY_ATTEMPTS: 'TOO_MANY_ATTEMPTS',
} as const;

export type LoginErrorCode = (typeof LoginErrorCode)[keyof typeof LoginErrorCode];

export interface LoginErrorExtension<TFields extends string = string> {
  code: LoginErrorCode;
  action: 'LOGIN';
  field?: TFields;
  fields?: readonly TFields[];
}