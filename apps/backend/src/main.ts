import { NestFactory } from "@nestjs/core"
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify"
import fastifyCookie from "@fastify/cookie"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"

async function bootstrap() {
  const adapter = new FastifyAdapter()

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  )

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  })

  const cookieSecret = process.env.COOKIE_SECRET
  if (!cookieSecret) {
    throw new Error('Критическая ошибка: COOKIE_SECRET не задан в файле .env!')
  }


  const fastifyInstance = app.getHttpAdapter().getInstance()
  await fastifyInstance.register(fastifyCookie, {
    secret: cookieSecret
  })

  const port = process.env.PORT ?? 3001
  await app.listen(port, '0.0.0.0')
  console.log(`[NestJS] Бэкэнд успешно запущен на порту: ${port}`)
}
bootstrap()