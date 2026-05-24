import { Resolver, Query, Args, Int, ResolveField, Parent } from '@nestjs/graphql'
import { desc } from 'drizzle-orm'
import { Inject } from '@nestjs/common'
import { GiftType } from './dto/gift.type'
import { UserType } from '../users/dto/user.type'
import { DRIZZLE } from '../db/db.module'
import * as schema from '../db/schema'
import { eq } from 'drizzle-orm'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'

@Resolver(() => GiftType)
export class GiftsResolver {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: PostgresJsDatabase<typeof schema>
  ) { }

  @Query(() => [GiftType], { name: 'allGifts' })
  async getAllGifts() {
    return this.db
      .select()
      .from(schema.gifts)
      .orderBy(desc(schema.gifts.createdAt));
  }
  @Query(() => GiftType, { name: 'giftById', nullable: true })
  async getGiftById(@Args('id', { type: () => Int }) id: number) {
    const [gift] = await this.db
      .select()
      .from(schema.gifts)
      .where(eq(schema.gifts.id, id))
      .limit(1)

    return gift || null
  }

  @ResolveField(() => UserType)
  async seller(@Parent() gift: GiftType) {
    const [seller] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, gift.sellerId))
      .limit(1)

    return seller
  }
}