import { Module, forwardRef } from '@nestjs/common'
import { UsersResolver } from './users.resolver'
import { UsersService } from './users.service'
import { MailModule } from '../mail/mail.module'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [
    MailModule,
    forwardRef(() => AuthModule)
  ],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule { }