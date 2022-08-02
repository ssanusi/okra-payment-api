import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { WalletsModule } from './wallets/wallets.module';
import { PaymentsModule } from './payments/payments.module';
import { RefundsModule } from './refunds/refunds.module';
import { AuthModule } from './auth/auth.module';
import { ConfigService, ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('mongo_url'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    UsersModule,
    WalletsModule,
    PaymentsModule,
    RefundsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
