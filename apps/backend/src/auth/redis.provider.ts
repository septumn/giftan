import Redis from 'ioredis';

export const RedisProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: () => {
    const redisHost = process.env.REDIS_HOST || 'redis';
    const redisPort = Number(process.env.REDIS_PORT) || 6379;

    console.log(`[ioredis] Попытка подключения к Redis по адресу: ${redisHost}:${redisPort}`)

    return new Redis({
      host: redisHost,
      port: redisPort,
      maxRetriesPerRequest: 1,
    })
  },
}