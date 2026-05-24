import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { UserType } from '../../users/dto/user.type';

@ObjectType('Gift')
export class GiftType {
  @Field(() => Int)
  id!: number;

  @Field()
  collection!: string;

  @Field()
  modelName!: string;

  @Field()
  symbol!: string;

  @Field()
  backdrop!: string;

  @Field(() => Int)
  collectibleNumber!: number;

  @Field()
  description!: string;

  @Field(() => Float)
  price!: number;

  @Field(() => [String])
  categories!: string[];

  @Field(() => Date)
  createdAt!: Date;

  @Field()
  sellerId!: string;

  @Field(() => UserType)
  seller!: UserType;
}