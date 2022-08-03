import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Connection, Model } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { WalletsService } from 'src/wallets/wallets.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment, PaymentDocument } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
    @Inject(WalletsService)
    private readonly walletService: WalletsService,
    @InjectConnection() private readonly connection: Connection,
  ) {}
  async create(createPaymentDto: CreatePaymentDto[], userId: string) {
    const transactions = [];
    if (Array.isArray(createPaymentDto)) {
      for (const payment of createPaymentDto) {
        transactions.push(
          await this.processPayment(payment, 'PAYMENT', userId),
        );
      }
      return transactions;
    }
  }

  async processPayment(createPaymentDto: CreatePaymentDto | any, type, userId) {
    let payment;
    if (type === 'PAYMENT') {
      payment = await this.paymentModel.create({
        amount: createPaymentDto.amount,
        debitWallet: createPaymentDto.wallet_to_debit,
        creditWallet: createPaymentDto.wallet_to_credit,
        currency: createPaymentDto.currency,
        type: type,
        refundableAmount: createPaymentDto.amount,
        owner: userId,
      });
    } else if (type === 'REFUND') {
      payment = await this.paymentModel
        .findOne({ _id: createPaymentDto.paymentId })
        .exec();
    }
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const debitWallet = await this.walletService.debitWallet(
        payment.debitWallet,
        payment.amount,
        'Payment',
        type,
        payment._id,
        session,
      );
      const creditWallet = await this.walletService.creditWallet(
        payment.creditWallet,
        payment.amount,
        'Payment',
        type,
        payment._id,
        session,
      );
      if (debitWallet && creditWallet) {
        const successfulTransaction = await this.paymentModel
          .findOneAndUpdate(
            { _id: payment._id },
            { status: 'SUCCESS' },
            { new: true },
          )
          .exec();
        await session.commitTransaction();
        session.endSession();
        return successfulTransaction;
      }
    } catch (error) {
      await session.abortTransaction();
      const failedTransaction = await this.paymentModel
        .findOneAndUpdate(
          { _id: payment._id },
          { status: 'FAILED', reason: error.message },
          { new: true },
        )
        .exec();
      if (error.status === HttpStatus.NOT_FOUND) {
        await this.walletService.reverseWalletTransactionDebit(
          payment._id,
          payment.amount,
          session,
        );
      }
      session.endSession();
      return failedTransaction;
    } finally {
      session.endSession();
    }
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.paymentModel.find({}).limit(limit).skip(offset);
  }

  async findOne(id: string) {
    const payment = await this.paymentModel.findOne({ _id: id }).exec();
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return payment;
  }

  async update(
    id: mongoose.Schema.Types.ObjectId | string,
    updatePaymentDto: UpdatePaymentDto,
  ) {
    const updatedPayment = await this.paymentModel.findOneAndUpdate(
      {
        _id: id,
      },
      updatePaymentDto,
      { new: true },
    );
    return updatedPayment;
  }
}
