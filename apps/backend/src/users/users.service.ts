<<<<<<< HEAD
import { Injectable, Inject, NotFoundException, InternalServerErrorException } from '@nestjs/common'
import Redis from 'ioredis';
import { DRIZZLE, type DrizzleDB } from 'src/db/db.module'
import { eq } from 'drizzle-orm';
import * as schema from '../db/schema'
import { UpdateProfileInput } from './dto/update-profile.input'
import { RemoveBanResponse } from 'src/auth/dto/responses/remove-ban.reponse'

@Injectable()
export class UsersService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    @Inject(DRIZZLE) private readonly db: DrizzleDB
  ) { }

  async findById(id: string) {
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .limit(1)

    if (!user) return null

    const { password, ...userWithoutPassword } = user

    return userWithoutPassword
  }

  async updateProfile(userId: string, input: UpdateProfileInput) {
    try {
      const [updatedUser] = await this.db
        .update(schema.users)
        .set({
          ...(input.name !== undefined && { name: input.name }),
          ...(input.bio !== undefined && { bio: input.bio })
        })
        .where(eq(schema.users.id, userId))
        .returning()

      if (!updatedUser) {
        throw new NotFoundException(`Пользователь с ID: ${userId} не найден`)
      }

      return updatedUser
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      console.error('[UpdatedProfile Error]:', error)
      throw new InternalServerErrorException('Не удалось обновить профиль')
    }
  }

  async removeUserFromBlacklist(userId: string): Promise<RemoveBanResponse> {
    try {
      await this.redis.del(`blacklist:${userId}`)
      return { success: true }
    } catch (error) {
      console.error('[Remove Blacklist Error]:', error)
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  }

  async blacklistUser(userId: string): Promise<{ success: boolean, error?: string }> {
    try {
      const BAN_TIME_SECONDS = 2592000
      await this.redis.set(`blacklist:${userId}`, 'true', 'EX', BAN_TIME_SECONDS)
      return { success: true }
    } catch (error) {
      console.error('[Blacklist Error]:', error)
      return {
        success: false,
        error: 'Не удалось сохранить сессию в чёрный список'
      }
    }
  }

  async updateAvatar(userId: string, image: string | null) {
    try {
      const [updateAvatar] = await this.db
        .update(schema.users)
        .set({ image })
        .where(eq(schema.users.id, userId))
        .returning()

      if (!updateAvatar) {
        throw new NotFoundException(`Пользователь с ID: ${userId} не найден`)
      }

      return updateAvatar
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      console.error('[UpdateAvatar Error]:', error)
      throw new InternalServerErrorException('Не удалось обновить аватар')
    }
  }
}
=======
import { Injectable } from '@nestjs/common'

@Injectable()
export class UsersService { }
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
