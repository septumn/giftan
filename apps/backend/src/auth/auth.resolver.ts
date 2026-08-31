<<<<<<< HEAD
import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql'
import { UseInterceptors } from '@nestjs/common'
import { ZodSerializerInterceptor } from '@/common/interceptors/zod-serializer.interceptor'
import { AuthService } from './auth.service'
import { Public } from '@/common/decorators/public.decorator'
import { UserType } from '@/users/dto/user.type'
import { RegisterResponseDto } from './dto/responses/register.response'
import { RegisterInputDto } from './dto/inputs/register.input'
import { VerifyEmailResponse } from './dto/responses/verify-email.response'
import { LoginInputSchema, LoginResponseSchema, RegisterResponseSchema } from '@giftan/contracts'
import { LogoutResponse } from './dto/responses/logout.response'
import { LoginResponseDto } from './dto/responses/login.response'
import { SetAccessTokenInterceptor } from './set-access-token.interceptor'
import { UpdateAccessTokenResponseDto } from './dto/responses/update-access-token.response'
import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { CurrentUserPayload } from '@/common/interfaces/current-user.interface'
import { TokenType } from '@/types/token'
=======
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { AuthService } from './auth.service'
import { Public } from '../common/decorators/public.decorator'
import { RegisterInput } from './dto/inputs/register.input'
import { UserType } from 'src/users/dto/user.type'
import { RegisterResponse } from './dto/responses/register.response'
import { VerifyResponse } from './dto/responses/verify.response'
import { SendEmailResponse } from '../mail/dto/send-email.response'
import { MailService } from 'src/mail/mail.service'
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78

@Resolver()
export class AuthResolver {
  constructor(
<<<<<<< HEAD
    private readonly authService: AuthService
  ) { }

  @Mutation(() => RegisterResponseDto, { name: 'register' })
  @Public()
  @UseInterceptors(new ZodSerializerInterceptor(RegisterResponseSchema))
  async register(
    @Args('input', { type: () => RegisterInputDto, nullable: false }) input: any
  ): Promise<RegisterResponseDto> {
    const validatedData = {
      name: input.name,
      email: input.email,
      password: input.password
    };

    return this.authService.registerCredentials(validatedData)
  }

  @Mutation(() => LoginResponseDto, { name: 'login' })
  @Public()
  async login(
    @Args('email') email: string,
    @Args('password') password: string
  ): Promise<LoginResponseDto> {

    const credentials = { email, password };
    LoginInputSchema.parse(credentials);

    const result = await this.authService.login(credentials);

    if (!result.success) return result as any;

    return {
      success: true,
      accessToken: result.accessToken,
    };
  }

  @Query(() => UpdateAccessTokenResponseDto, { name: 'updateAccessToken' })
  @UseInterceptors(SetAccessTokenInterceptor)
  async updateAccessToken(@CurrentUser() currentUser: CurrentUserPayload) {
    return this.authService.generateAccessToken(currentUser.id)
=======
    private readonly authService: AuthService,
    private readonly mailService: MailService
  ) { }

  @Mutation(() => RegisterResponse, { name: 'register' })
  @Public()
  async register(@Args('input') input: RegisterInput) {
    return this.authService.registerCredentials(input.email, input.name, input.password)
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
  }

  @Query(() => UserType, { name: 'validateUser', nullable: true })
  @Public()
  async validateUser(
<<<<<<< HEAD
    @Args('email', { type: () => String }) email: string,
    @Args('password', { type: () => String }) password: string
  ): Promise<UserType | null> {
    const user = await this.authService.validateUser(email, password);
    if (!user) return null;

    return {
      ...user,
      emailVerified: user.emailVerified || null,
      role: user.role as any
    };
  }

  @Mutation(() => VerifyEmailResponse, { name: 'verifyEmail' })
  @Public()
  async verifyEmail(
    @Args('token', { type: () => String }) token: string
  ): Promise<VerifyEmailResponse> {
    return this.authService.verifyEmail(token)
  }

  @Query(() => Number, { name: 'getTokenDispatchTime', nullable: true })
  @Public()
  async getTokenDispatchTime(
    @Args('email', { type: () => String }) email: string
  ): Promise<number | null> {
    return this.authService.getTokenDispatchTime(email)
  }

  @Mutation(() => LogoutResponse, { name: 'logout' })
  async logout(
    @CurrentUser() user: TokenType,
    @Context() ctx: any
  ): Promise<LogoutResponse> {
    const reply = ctx?.reply 

    return this.authService.logout(user.id, reply);
=======
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
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
  }
}