import { Resolver, Mutation, Query, Args, Context } from '@nestjs/graphql';
import { UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '@/common/decorators/public.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { ZodSerializerInterceptor } from '@/common/interceptors/zod-serializer.interceptor';
import { SetAccessTokenInterceptor } from './set-access-token.interceptor';
import {
  RegistrationInputSchema,
  RegistrationResponseSchema
} from '@giftan/shared/auth/registration/contract';
import {
  LoginInputSchema,
  LoginResponseSchema
} from '@giftan/shared/auth/login/contract';
import { RegisterInputDto } from './dto/inputs/register.input';
import { LoginInputDto } from './dto/inputs/login.input';
import { RegisterResponseDto } from './dto/responses/register.response';
import { LoginResponseDto } from './dto/responses/login.response';
import { VerifyEmailResponse } from './dto/responses/verify-email.response';
import { LogoutResponse } from './dto/responses/logout.response';
import { UpdateAccessTokenResponseDto } from './dto/responses/update-access-token.response';
import { UserType } from '@/users/dto/user.type';
import { type CurrentUserPayload } from '@/common/interfaces/current-user.interface';
import { UserRole } from '@/common/enums/role.enum';
import { UsePipes } from '@nestjs/common';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Mutation(() => RegisterResponseDto, { name: 'register' })
  @Public()
  @UseInterceptors(new ZodSerializerInterceptor(RegistrationResponseSchema))
  @UsePipes(new ZodValidationPipe(RegistrationInputSchema))
  async register(
    @Args('input', { type: () => RegisterInputDto }) input: RegisterInputDto,
  ): Promise<RegisterResponseDto> {
    return this.authService.registerCredentials(input);
  }

  @Mutation(() => LoginResponseDto, { name: 'login' })
  @Public()
  @UseInterceptors(
    new ZodSerializerInterceptor(LoginResponseSchema),
    SetAccessTokenInterceptor,
  )
  @UsePipes(new ZodValidationPipe(LoginInputSchema))
  async login(
    @Args('input', { type: () => LoginInputDto }) input: LoginInputDto,
  ): Promise<LoginResponseDto> {
    return this.authService.login(input);
  }

  @Query(() => UpdateAccessTokenResponseDto, { name: 'updateAccessToken' })
  @UseInterceptors(SetAccessTokenInterceptor)
  async updateAccessToken(
    @CurrentUser() currentUser: CurrentUserPayload,
  ): Promise<UpdateAccessTokenResponseDto> {
    const result = await this.authService.generateAccessToken(currentUser.id);

    return {
      success: true,
      accessToken: result.accessToken,
    };
  }

  @Query(() => UserType, { name: 'validateUser', nullable: true })
  @Public()
  async validateUser(
    @Args('input', { type: () => LoginInputDto }, new ZodValidationPipe(LoginInputSchema))
    input: LoginInputDto,
  ): Promise<UserType | null> {
    const user = await this.authService.validateUser(input.email, input.password);
    if (!user) return null;

    return {
      ...user,
      emailVerified: user.emailVerified ?? null,
      role: user.role as UserRole,
    };
  }

  @Mutation(() => VerifyEmailResponse, { name: 'verifyEmail' })
  @Public()
  async verifyEmail(
    @Args('token', { type: () => String }) token: string,
  ): Promise<VerifyEmailResponse> {
    return this.authService.verifyEmail(token);
  }

  @Query(() => Number, { name: 'getTokenDispatchTime', nullable: true })
  @Public()
  async getTokenDispatchTime(
    @Args('email', { type: () => String }) email: string,
  ): Promise<number | null> {
    return this.authService.getTokenDispatchTime(email);
  }

  @Mutation(() => LogoutResponse, { name: 'logout' })
  async logout(
    @CurrentUser() user: CurrentUserPayload,
    @Context() ctx: { reply: any },
  ): Promise<LogoutResponse> {
    return this.authService.logout(user.id, ctx.reply);
  }
}