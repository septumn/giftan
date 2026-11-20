import { Injectable, Inject, OnModuleInit } from "@nestjs/common"
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from "rxjs"

export type EmailTemplate = 'verify_email' | 'change_email' | 'change_password'

export interface SendEmailPayload {
  to: string
  template: EmailTemplate
  data: Record<string, any>
}

@Injectable()
export class MailService implements OnModuleInit{
  constructor(
    @Inject('MAIL_SERVICE') private readonly mailClient: ClientProxy
  ) { }

  async onModuleInit() {
    await this.mailClient.connect()
  }

  async sendMail(payload: SendEmailPayload) {
    await firstValueFrom(this.mailClient.emit('send_email', payload))
  }
}