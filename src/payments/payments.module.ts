import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment, PaymentSchema } from './entities/payment.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from 'src/wallets/entities/wallet.entity';
import { WalletsService } from 'src/wallets/wallets.service';
import { User, UserSchema } from 'src/users/entities/user.entity';
import {
  WalletTransaction,
  WalletTransactionSchema,
} from 'src/wallets/entities/wallet-transaction.entity';
import { RefundsService } from 'src/refunds/refunds.service';
import { Refund, RefundSchema } from 'src/refunds/entities/refund.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
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
      {
        name: Refund.name,
        schema: RefundSchema,
      },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, WalletsService, RefundsService],
})
export class PaymentsModule {}
