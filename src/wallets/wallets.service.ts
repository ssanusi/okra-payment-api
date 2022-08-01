import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { User } from 'src/users/entities/user.entity';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectModel(Wallet.name) private readonly walletModel: Model<Wallet>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async create(createWalletDto: CreateWalletDto) {
    const user = await this.userModel.findOne({
      _id: createWalletDto.owner,
    }).exec;
    if (!user) {
      throw new NotFoundException(
        `User with id ${createWalletDto.owner} not found`,
      );
    }
    const wallet = new this.walletModel({
      owner: createWalletDto.owner,
      balance: createWalletDto.amount,
      currency: createWalletDto.currency,
      dailyLimit: createWalletDto.dailyLimit,
    });
    wallet.save();
    await this.userModel
      .findOneAndUpdate({ _id: createWalletDto.owner }, { $push: { wallet } })
      .exec();
    return wallet;
  }

  findAll(PaginationQuery: PaginationQueryDto) {
    const { limit, offset } = PaginationQuery;
    return this.walletModel.find({}).skip(offset).limit(limit);
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
      .findOneAndUpdate({ _id: id }, { $set: UpdateWalletDto }, { new: true })
      .exec();
    if (!existingWallet) {
      throw new NotFoundException(`wallet with #${id} not found`);
    }
    return existingWallet;
  }
}
