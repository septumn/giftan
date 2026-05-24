import { forwardRef, Module } from '@nestjs/common'
import { RedisProvider } from './redis.provider'
import { GqlAuthGuard } from '../common/guard/gql-auth.guard'
import { AuthResolver } from './auth.resolver'
import { UsersModule } from 'src/users/users.module'
import { AuthService } from './auth.service';
import { MailModule } from 'src/mail/mail.module'

@Module({
  imports: [
    forwardRef(() => UsersModule),
    MailModule
  ],
  providers: [RedisProvider, GqlAuthGuard, AuthResolver, AuthService],
  exports: [RedisProvider, GqlAuthGuard],
})
export class AuthModule { }