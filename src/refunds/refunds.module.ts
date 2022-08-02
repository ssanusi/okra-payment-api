import { Module } from '@nestjs/common';
import { RefundsService } from './refunds.service';
import { RefundsController } from './refunds.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Refund, RefundSchema } from './entities/refund.entity';
import { Payment, PaymentSchema } from 'src/payments/entities/payment.entity';
import { PaymentsService } from 'src/payments/payments.service';
import { WalletsService } from 'src/wallets/wallets.service';
import { Wallet, WalletSchema } from 'src/wallets/entities/wallet.entity';
import { User, UserSchema } from 'src/users/entities/user.entity';
import {
  WalletTransaction,
  WalletTransactionSchema,
} from 'src/wallets/entities/wallet-transaction.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Refund.name,
        schema: RefundSchema,
      },
      {
        name: Payment.name,
        schema: PaymentSchema,
      },
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
  controllers: [RefundsController],
  providers: [RefundsService, PaymentsService, WalletsService],
})
export class RefundsModule {}
