import { ObjectType, Field } from '@nestjs/graphql';
import type { UpdateAccessTokenResponse } from '@giftan/shared/auth/update-access-token/contract';

type UpdateAccessTokenResponseFields = {
  [K in keyof UpdateAccessTokenResponse]?: UpdateAccessTokenResponse extends Record<K, infer T> ? T : never;
} & { success: boolean };

@ObjectType()
export class UpdateAccessTokenResponseDto implements UpdateAccessTokenResponseFields {
  @Field(() => Boolean, { description: 'Флаг успешного обновления токен доступа' })
  success!: boolean;

  @Field(() => String, { nullable: true, description: 'Токен доступа' })
  accessToken?: string;

  @Field(() => String, { nullable: true, description: 'Код ошибки' })
  errorCode?: string;
}