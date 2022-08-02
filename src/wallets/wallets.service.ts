import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { User, userDocument } from 'src/users/entities/user.entity';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import {
  WalletTransaction,
  WalletTransactionDocument,
} from './entities/wallet-transaction.entity';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectModel(Wallet.name)
    private readonly walletModel: Model<Wallet>,
    @InjectModel(User.name) private readonly userModel: Model<userDocument>,
    @InjectModel(WalletTransaction.name)
    private readonly WalletTransactionModel: Model<WalletTransactionDocument>,
  ) {}
  async create(createWalletDto: CreateWalletDto) {
    const user = await this.userModel
      .findOne({
        _id: createWalletDto.owner,
      })
      .exec();
    if (!user) {
      throw new NotFoundException(
        `User with id ${createWalletDto.owner} not found`,
      );
    }
    const wallet = await this.walletModel.create({
      owner: createWalletDto.owner,
      balance: createWalletDto.amount,
      currency: createWalletDto.currency,
      dailyLimit: createWalletDto.dailyLimit,
    });
    if (!wallet) {
      throw new HttpException(
        `Unable to create wallet for user with id ${createWalletDto.owner}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    await this.userModel
      .findOneAndUpdate(
        { _id: createWalletDto.owner },
        { $push: { wallets: wallet._id } },
        { new: true },
      )
      .exec();

    return wallet;
  }

  findAll(PaginationQuery: PaginationQueryDto) {
    const { limit, offset } = PaginationQuery;
    return this.walletModel
      .find({})
      .populate('owner')
      .skip(offset)
      .limit(limit);
  }

  async findOne(id: string) {
    const wallet = await this.walletModel
      .findOne({ _id: id })
      .populate('owner')
      .exec();
    if (!wallet) {
      throw new NotFoundException(`Wallets with id ${id} not found`);
    }
    return wallet;
  }
  async update(id: string, updateWalletDto: UpdateWalletDto) {
    const existingWallet = await this.walletModel
      .findOneAndUpdate({ _id: id }, { $set: updateWalletDto }, { new: true })
      .exec();
    if (!existingWallet) {
      throw new NotFoundException(`wallet with #${id} not found`);
    }
    return existingWallet;
  }

  async creditWallet(
    id: mongoose.Schema.Types.ObjectId | string,
    amount: number,
    description: string,
    type: string,
    paymentId?: string,
    session?: any,
  ) {
    const wallet = await this.walletModel.findOne({ _id: id }).exec();
    if (!wallet) {
      throw new NotFoundException(`wallet with id ${id} not found`);
    }
    const creditWallet = await this.walletModel
      .findOneAndUpdate(
        { _id: wallet._id },
        { $inc: { balance: amount } },
        { new: true, session: session },
      )
      .exec();
    if (!creditWallet) {
      throw new HttpException(
        'Unable to debit wallet',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const walletTransaction = new this.WalletTransactionModel({
      action: 'CREDIT',
      type: type,
      amount: amount,
      balanceBeforeTransaction: wallet.balance,
      balanceAfterTransaction: wallet.balance + amount,
      walletId: wallet._id,
      paymentId: paymentId,
      date: new Date(),
      description: description,
    });
    walletTransaction.save();
    return wallet;
  }

  async debitWallet(
    id: mongoose.Schema.Types.ObjectId | string,
    amount: number,
    description: string,
    type: string,
    paymentId?: string,
    session?: any,
  ) {
    const wallet = await this.walletModel.findOne({ _id: id }).exec();
    if (!wallet) {
      throw new NotFoundException(`wallet with id ${id} not found`);
    }
    if (
      (wallet.balance < amount || wallet.balance <= 0) &&
      type === 'PAYMENT'
    ) {
      throw new HttpException('Insufficient funds', HttpStatus.BAD_REQUEST);
    }
    const debitWallet = await this.walletModel
      .findOneAndUpdate(
        { _id: wallet._id },
        { $inc: { balance: -amount } },
        { new: true, session: session },
      )
      .exec();
    if (!debitWallet) {
      throw new HttpException(
        'Unable to debit wallet',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const walletTransaction = new this.WalletTransactionModel({
      action: 'DEBIT',
      type,
      balanceBeforeTransaction: wallet.balance,
      balanceAfterTransaction: wallet.balance - amount,
      amount: amount,
      date: new Date(),
      description: description,
      paymentId: paymentId,
      walletId: wallet._id,
    });
    walletTransaction.save();
    return wallet;
  }

  async reverseWalletTransactionDebit(
    id: mongoose.Schema.Types.ObjectId | string,
    amount: number,
    session?: any,
  ) {
    const debitedWalletTransaction = await this.WalletTransactionModel.findOne({
      paymentId: id,
    }).exec();

    const reverseWalletTransaction = new this.WalletTransactionModel({
      action: 'CREDIT',
      type: 'REVERSE_DEBIT',
      balanceAfterTransaction:
        debitedWalletTransaction.balanceBeforeTransaction, // balance before transaction
      balanceBeforeTransaction:
        debitedWalletTransaction.balanceAfterTransaction, // balance after transaction
      amount: amount,
      date: new Date(),
      description: `Reversal for payment ${debitedWalletTransaction.paymentId}`,
      paymentId: debitedWalletTransaction.paymentId,
      walletId: debitedWalletTransaction.walletId,
    });
    reverseWalletTransaction.save({ session });
    return reverseWalletTransaction;
  }

  async fundWallet(
    id: mongoose.Schema.Types.ObjectId | string,
    amount: number,
  ) {
    const wallet = await this.creditWallet(
      id,
      amount,
      'Funding wallet',
      'FUND-WALLET',
    );
    return wallet;
  }
}
