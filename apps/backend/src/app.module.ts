import { Module } from '@nestjs/common'
<<<<<<< HEAD
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
=======
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
import { DbModule } from './db/db.module'
import { GraphQLModule } from '@nestjs/graphql'
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius'
import { join } from 'path'
import { GiftsModule } from './gifts/gifts.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core'
import { GqlAuthGuard } from './common/guard/gql-auth.guard'
<<<<<<< HEAD
import { TestsModule } from './tests/tests.module'
import { JwtModule } from '@nestjs/jwt'
=======
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78

@Module({
  imports: [
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      graphiql: true,
<<<<<<< HEAD
      context: (request, reply) => ({ request, reply }),
=======
      context: ({ req, res }) => ({ req, res }),
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    DbModule,
    GiftsModule,
    UsersModule,
    MailModule,
    AuthModule,
<<<<<<< HEAD
    TestsModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: GqlAuthGuard,
    }
  ],
})
export class AppModule { }
=======
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useExisting: GqlAuthGuard,
  }],
})
export class AppModule { }
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
