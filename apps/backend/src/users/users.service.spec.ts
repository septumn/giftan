import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { DRIZZLE } from 'src/db/db.module'
import { NotFoundException, InternalServerErrorException } from '@nestjs/common'

const mockRedis = {
  del: jest.fn(),
  set: jest.fn(),
}

const mockDrizzle = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  returning: jest.fn().mockReturnThis(),
}

describe('UsersService', () => {
  let service: UsersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: 'REDIS_CLIENT', useValue: mockRedis },
        { provide: DRIZZLE, useValue: mockDrizzle }
      ],
    }).compile()

    service = await module.get<UsersService>(UsersService)
    jest.clearAllMocks()
  })

  describe('findById', () => {
    it('должен вернуть пользователя, если он найден в БД', async () => {
      const mockUser = { id: 'user-1', name: 'Ivan' }
      mockDrizzle.limit.mockResolvedValue([mockUser])

      const result = await service.findById(mockUser.id)

      expect(result).toEqual(mockUser)
      expect(mockDrizzle.select).toHaveBeenCalled()
    })

    it('должен вернуть null, если он не найден в БД', async () => {
      mockDrizzle.limit.mockResolvedValue([])

      const result = await service.findById('invalid-id')

      expect(result).toBeNull()
    })
  })

  describe('updateAvatar', () => {
    it('должен успешно обновить аватар', async () => {
      const mockUpdatedUser = { id: 'user-1', image: 'new-avatar.webp' }
      mockDrizzle.returning.mockResolvedValue([mockUpdatedUser])

      const result = await service.updateAvatar(mockUpdatedUser.id, mockUpdatedUser.image)

      expect(result).toEqual(mockUpdatedUser)
    })

    it('должен выбросить NotFoundException, если пользователя не существует', async () => {
      mockDrizzle.returning.mockResolvedValue([])

      await expect(service.updateAvatar('999', 'pic.webp')).rejects.toThrow(NotFoundException)
    })

    it('должен выбросить InternalServerErrorException при падении БД', async () => {
      mockDrizzle.returning.mockRejectedValue(new Error('DB Connection Lost'))

      await expect(service.updateAvatar('1', 'pic.webp')).rejects.toThrow(InternalServerErrorException)
    })
  })

  describe('blacklistUser', () => {
    it('должен вернуть success: true при успешной записи в Redis', async () => {
      mockRedis.set.mockResolvedValue('OK')

      const result = await service.blacklistUser('user-1')

      expect(result).toEqual({ success: true })
      expect(mockRedis.set).toHaveBeenCalledWith(
        'blacklist:user-1',
        'true',
        'EX',
        2592000,
      )
    })

    it('должен вернуть ошибку, если Redis недоступен', async () => {
      mockRedis.set.mockRejectedValue(new Error('Redis down'))

      const result = await service.blacklistUser('user-1')

      expect(result).toEqual({
        success: false,
        error: 'Не удалось сохранить сессию в чёрный список',
      })
    })
  })
})
