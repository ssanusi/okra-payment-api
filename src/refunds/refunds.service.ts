import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Payment, PaymentDocument } from 'src/payments/entities/payment.entity';
import { PaymentsService } from 'src/payments/payments.service';
import { CreateRefundDto } from './dto/create-refund.dto';
import { Refund, RefundDocument } from './entities/refund.entity';

@Injectable()
export class RefundsService {
  constructor(
    @InjectModel(Refund.name)
    private readonly refundModel: Model<RefundDocument>,
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
    @Inject(PaymentsService)
    private readonly paymentService: PaymentsService,
  ) {}
  async create(createRefundDto: CreateRefundDto, userId: string) {
    const payment = await this.paymentModel
      .findOne({ _id: createRefundDto.paymentId })
      .exec();
    if (!payment) {
      throw new HttpException(
        `Payment with id ${createRefundDto.paymentId} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (payment.isFullyRefunded) {
      throw new HttpException(
        `Payment with id ${createRefundDto.paymentId} is fully refunded`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (payment.refundableAmount < createRefundDto.amount) {
      throw new HttpException(
        `Refund amount ${createRefundDto.amount} is greater than Refundable amount ${payment.refundableAmount}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (payment.refundableAmount >= createRefundDto.amount) {
      const transaction = await this.paymentService.processPayment(
        {
          amount: createRefundDto.amount,
          wallet_to_debit: payment.creditWallet,
          wallet_to_credit: payment.debitWallet,
          currency: payment.currency,
          paymentId: payment._id,
        },
        'REFUND',
        userId,
      );
      if (transaction) {
        const refund = new this.refundModel({
          paymentId: payment._id,
          amount: createRefundDto.amount,
          walletDebited: transaction.creditWallet,
          walletCredited: transaction.debitWallet,
          type: createRefundDto.amount === payment.amount ? 'FULL' : 'PARTIAL',
        });
        refund.save();
        await this.paymentModel
          .findOneAndUpdate(
            { _id: payment._id },
            {
              isFullyRefunded: transaction.amount === payment.refundableAmount,
              refundableAmount: payment.refundableAmount - transaction.amount,
            },
            { new: true },
          )
          .exec();
        return refund;
      }
    }
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const { offset, limit } = paginationQuery;
    const refunds = await this.refundModel.find({}).skip(offset).limit(limit);
    return refunds;
  }

  async findOne(id: string) {
    const refund = await this.refundModel.findOne({ _id: id }).exec();
    if (!refund) {
      throw new HttpException(
        `Refund with id ${id} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return refund;
  }
}
