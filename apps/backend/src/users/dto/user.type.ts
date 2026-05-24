import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql'
import { UserRole } from '../../common/enums/role.enum'
import { GiftType } from '../../gifts/dto/gift.type'
import { InferSelectModel } from 'drizzle-orm'
import { users } from 'src/db/schema';

registerEnumType(UserRole, { name: 'UserRole' });

type DbUser = InferSelectModel<typeof users>;

@ObjectType('User')
export class UserType implements Omit<DbUser, 'password'> {
  @Field(() => ID)
  id!: string;

  @Field(() => String, { nullable: true })
  name!: string | null;

  @Field(() => String, { nullable: true })
  email!: string | null;

  @Field(() => Date, { nullable: true })
  emailVerified!: Date | null;

  @Field(() => String, { nullable: true })
  bio!: string | null;

  @Field(() => String, { nullable: true })
  image!: string | null;

  @Field(() => String, { nullable: true })
  confirmationSentAt!: Date | null;

  @Field(() => UserRole)
  role!: UserRole;

  @Field(() => Boolean)
  isBlocked!: boolean;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => [GiftType], { nullable: true })
  soldGifts?: GiftType[];
}