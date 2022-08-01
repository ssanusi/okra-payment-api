import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { WalletsModule } from './wallets/wallets.module';
@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://root:pass12345@localhost:27017/payment?serverSelectionTimeoutMS=2000&authSource=admin`,
    ),
    UsersModule,
    WalletsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
