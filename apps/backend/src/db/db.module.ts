import { Module, Global, OnModuleDestroy, Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

export const DRIZZLE = 'DRIZZLE'

export type DrizzleDB = PostgresJsDatabase<typeof schema>

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL')
        if (!databaseUrl) {
          throw new Error('DATABASE_URL не найден в переменных окружения!')
        }

        const queryClient = postgres(databaseUrl, {
          max: 10,
        })

        const db = drizzle(queryClient, { schema })

        ;(db as any).$client = queryClient

        return db
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DbModule implements OnModuleDestroy {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async onModuleDestroy() {
    const client = (this.db as any).$client
    if (client) {
      await client.end()
    }
  }
}