import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { Wallet, WalletSchema } from './entities/wallet.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/entities/user.entity';
import {
  WalletTransactionSchema,
  WalletTransaction,
} from './entities/wallet-transaction.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Wallet.name,
        schema: WalletSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: WalletTransaction.name,
        schema: WalletTransactionSchema,
      },
    ]),
  ],
  controllers: [WalletsController],
  providers: [WalletsService],
})
export class WalletsModule {}
