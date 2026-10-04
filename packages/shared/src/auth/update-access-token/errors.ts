export const UpdateAccessTokenErrorCode = {
  INVALID_REFRESH_TOKEN: 'INVALID_REFRESH_TOKEN',
  REFRESH_TOKEN_EXPIRED: 'REFRESH_TOKEN_EXPIRED',
  REFRESH_TOKEN_REVOKED: 'REFRESH_TOKEN_REVOKED',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
} as const;

export type UpdateAccessTokenErrorCode =
  (typeof UpdateAccessTokenErrorCode)[keyof typeof UpdateAccessTokenErrorCode];

export interface UpdateAccessTokenErrorExtension<TFields extends string = string> {
  code: UpdateAccessTokenErrorCode;
  action: 'UPDATE_ACCESS_TOKEN';
  field?: TFields;
  fields?: readonly TFields[];
}