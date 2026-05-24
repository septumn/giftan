import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { AuthService } from './auth.service'
import { Public } from '../common/decorators/public.decorator'
import { RegisterInput } from './dto/inputs/register.input'
import { UserType } from 'src/users/dto/user.type'
import { RegisterResponse } from './dto/responses/register.response'
import { VerifyResponse } from './dto/responses/verify.response'
import { SendEmailResponse } from '../mail/dto/send-email.response'
import { MailService } from 'src/mail/mail.service'

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService
  ) { }

  @Mutation(() => RegisterResponse, { name: 'register' })
  @Public()
  async register(@Args('input') input: RegisterInput) {
    return this.authService.registerCredentials(input.email, input.name, input.password)
  }

  @Query(() => UserType, { name: 'validateUser', nullable: true })
  @Public()
  async validateUser(
    @Args('email') email: string,
    @Args('password') password: string
  ) {
    return this.authService.validateUser(email, password);
  }

  @Mutation(() => VerifyResponse, { name: 'verifyEmail' })
  @Public()
  async verifyEmail(@Args('token') token: string): Promise<VerifyResponse> {
    return this.authService.verifyToken(token)
  }

  @Mutation(() => SendEmailResponse, { name: 'resendVerificationEmail' })
  @Public()
  async resendVerificationEmail(@Args('email') email: string): Promise<SendEmailResponse> {
    await this.mailService.sendMailAgain(email);

    return { success: true };
  }
}