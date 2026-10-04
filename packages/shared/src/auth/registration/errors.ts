export const RegistrationErrorCode = {
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  NAME_ALREADY_EXISTS: 'NAME_ALREADY_EXISTS',
  NAME_AND_EMAIL_TAKEN: 'NAME_AND_EMAIL_TAKEN',
} as const;

export type RegistrationErrorCode = (typeof RegistrationErrorCode)[keyof typeof RegistrationErrorCode];

export interface RegistrationErrorExtension<TFields extends string = string> {
  code: RegistrationErrorCode;
  action: 'REGISTRATION';
  field?: TFields;
  fields?: readonly TFields[];
}