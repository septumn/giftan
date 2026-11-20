import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { MailService } from './mail.service'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MAIL_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672/'],
          queue: 'mail.queue',
          queueOptions: {
            durable: true
          }
        }
      }
    ])
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule { }
