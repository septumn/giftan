import { Injectable, Inject, BadRequestException, InternalServerErrorException } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import { DRIZZLE, type DrizzleDB } from "../db/db.module"
import { activateTokens } from "../db/schema"
import { eq, desc } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"
import { SendEmailResponse } from './dto/send-email.response'

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB
  ) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD
      },
    })
  }

  async sendVerificationEmail(email: string, confirmLink: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"Наш Сервис" <${process.env.EMAIL_SERVER_USER}>`,
        to: email,
        subject: 'Подтверждение входа',
        html: `
          <div style="background-color: #f9f9f9; padding: 50px 20px; font-family: sans-serif;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <tr>
                <td style="padding: 40px 30px; text-align: center;">
                  <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">Подтвердите ваш Email</h1>
                  <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
                    Здравствуйте! Чтобы активировать ваш аккаунт, пожалуйста, нажмите на кнопку ниже:
                  </p>
                  <a href="${confirmLink}" 
                     style="background-color: #4CAF50; 
                            color: white; 
                            padding: 14px 28px; 
                            text-decoration: none; 
                            border-radius: 5px; 
                            font-weight: bold; 
                            display: inline-block;
                            font-size: 16px;">
                     Подтвердить почту
                  </a>
                  <p style="color: #999; font-size: 14px; margin-top: 30px;">
                    Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.
                  </p>
                </td>
              </tr>
            </table>
          </div>
        `,
      });
    } catch (error) {
      console.error("Ошибка при отправке SMTP-уведомления:", error);
      throw new InternalServerErrorException('Не удалось отправить письмо подтверждения. Повторите позже.');
    }
  }

  async sendMailAgain(email: string): Promise<SendEmailResponse> {
    const [lastToken] = await this.db
      .select()
      .from(activateTokens)
      .where(eq(activateTokens.email, email))
      .orderBy(desc(activateTokens.expires))
      .limit(1)

    if (lastToken) {
      const TOKEN_LIFETIME_MS = 3600 * 1000
      const COOLDOWN_SECONDS = 120

      const createdAt = new Date(lastToken.expires.getTime() - TOKEN_LIFETIME_MS)
      const diffInSeconds = Math.floor((Date.now() - createdAt.getTime()) / 1000)

      if (diffInSeconds < COOLDOWN_SECONDS) {
        throw new BadRequestException(`Подождите ещё ${COOLDOWN_SECONDS - diffInSeconds} секунд для повторной отправки письма`);
      }
    }

    const token = uuidv4()
    const expires = new Date(Date.now() + 3600 * 1000)
    const confirmLink = `${process.env.NEXT_APP_URL}/auth/verification?token=${token}`

    await this.sendVerificationEmail(email, confirmLink)

    await this.db.transaction(async (tx) => {
      await tx.delete(activateTokens).where(eq(activateTokens.email, email))
      await tx.insert(activateTokens).values({
        email,
        token,
        expires
      })
    })

    return { success: true }
  }
}