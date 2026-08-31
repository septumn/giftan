import { Resolver, Mutation, Args } from "@nestjs/graphql"
import { MailService } from "./mail.service"
import { SendEmailResponse } from "./dto/send-email.response"

@Resolver()
export class MailResolver {
  constructor(private readonly mailService: MailService) { }

  @Mutation(() => SendEmailResponse, { name: 'resendVerificationEmail' })
  async resendEmail(@Args('email', { type: () => String }) email: string): Promise<SendEmailResponse> {
    return this.mailService.resendVerificationEmail(email)
  }
}