import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql'
import { Inject, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { UserType } from './dto/user.type'
import { UpdateProfileInput } from './dto/update-profile.input'
import { DRIZZLE } from '../db/db.module'
import * as schema from '../db/schema'
import { eq } from 'drizzle-orm'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { LogoutResponse } from 'src/auth/dto/responses/logout.response'
import { Public } from 'src/common/decorators/public.decorator'
import Redis from 'ioredis'

@Resolver(() => UserType)
export class UsersResolver {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    @Inject(DRIZZLE) private readonly db: PostgresJsDatabase<typeof schema>
  ) { }

  @Query(() => UserType, { name: 'userById', nullable: true })
  async getUserById(@Args('id', { type: () => ID }) id: string) {
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .limit(1)

    return user || null
  }

  @Query(() => UserType, { name: 'me', nullable: true })
  async getMe(@CurrentUser() currentUser: any) {
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, currentUser.id))
      .limit(1)

    return user || null
  }

  @Query(() => Boolean, { name: 'legitCheck' })
  async legitCheck(@CurrentUser() currentUser: any): Promise<boolean> {
    console.log(`[LEGIT CHECK] Пользователь ${currentUser.id} успешно прошёл проверку легитимности`)

    return true
  }

  @Mutation(() => UserType, { name: 'updateProfile' })
  async updateProfile(
    @CurrentUser() currentUser: any,
    @Args('input') input: UpdateProfileInput
  ) {
    try {
      const [updatedUser] = await this.db
        .update(schema.users)
        .set({
          ...(input.name !== undefined && { name: input.name }),
          ...(input.bio !== undefined && { bio: input.bio })
        })
        .where(eq(schema.users.id, currentUser.id))
        .returning()

      if (!updatedUser) {
        throw new NotFoundException(`Пользователь с ID ${currentUser.id} не найден в базе данных`)
      }

      return updatedUser

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }

      console.error('[UpdateProfile Mutation Error]:', error)
      throw new InternalServerErrorException('Не удалось обновить профиль.')
    }
  }

  @Mutation(() => LogoutResponse, { name: 'logout' })
  async logout(@Context() context: any): Promise<LogoutResponse> {
    const req = context.req || (context.reply && context.reply.request)

    const authHeader = req.headers.authorization
    if (!authHeader) return { success: false }

    const [type, token] = authHeader.split(' ')
    if (type !== 'Bearer' || !token) return { success: false }

    try {
      const currentUser = req.user;

      if (currentUser && currentUser.id) {
        const BAN_TIME_SECONDS = 2592000
        await this.redis.set(`blacklist:${currentUser.id}`, 'true', 'EX', BAN_TIME_SECONDS)
        console.log(`[REDIS BAN] Успешно заблокирован пользователь с ID: ${currentUser.id}`)
      }

      return { success: true }
    } catch (error) {
      console.error('[Logout Error]:', error)
      return { success: false }
    }
  }

  @Mutation(() => LogoutResponse, { name: 'refreshSession' })
  @Public()
  async refreshSession(
    @Args('userId', { type: () => String }) userId: string
  ): Promise<LogoutResponse> {
    try {
      if (userId) {
        await this.redis.del(`blacklist:${userId}`)
        console.log(`[REDIS SUCCESS] Легитимный вход! Все баны автоматически сняты для пользователя: ${userId}`)
        return { success: true }
      }

      return { success: false }
    } catch (error) {
      console.error('[RefreshSession Error]: ', error)
      return { success: false }
    }
  }

  @Mutation(() => UserType, { name: 'uploadAvatar' })
  async updateAvatar(
    @CurrentUser() currentUser: any,
    @Args('image', { type: () => String, nullable: true }) image: string | null
  ) {
    const [updatedUser] = await this.db
      .update(schema.users)
      .set({ image })
      .where(eq(schema.users.id, currentUser.id))
      .returning();

    return updatedUser;
  }
}