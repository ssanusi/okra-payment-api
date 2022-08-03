import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findByEmail(email: string) {
    const user = await this.userModel
      .findOne({ email })
      .populate('wallet')
      .exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }
  async create(createUserDto: CreateUserDto) {
    const user = await this.userModel
      .findOne({ email: createUserDto.email })
      .exec();
    if (user) {
      throw new HttpException(
        `User with email ${createUserDto.email} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  findAll(PaginationQuery: PaginationQueryDto) {
    const { limit, offset } = PaginationQuery;
    return this.userModel
      .find({})
      .populate({
        path: 'wallets',
        select: ['balance', 'currency', 'dailyLimit'],
      })
      .skip(offset)
      .limit(limit);
  }

  async findOne(id: string) {
    const user = await this.userModel
      .findOne({ _id: id })
      .populate({
        path: 'wallets',
        select: ['balance', 'currency', 'dailyLimit'],
      })
      .exec();
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.userModel
      .findOneAndUpdate({ _id: id }, { $set: updateUserDto }, { new: true })
      .exec();
    if (!existingUser) {
      throw new NotFoundException(`User with #${id} not found`);
    }
    return existingUser;
  }

  async remove(id: string) {
    const user = await this.userModel.findOneAndRemove({ _id: id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async validateUser(email: string, password: string) {
    const user = await this.userModel.findOne({ email }).exec();
    if (user && bcrypt.compareSync(password, user.password)) {
      const { _id, email } = user;
      return { userId: _id, email };
    }
    throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
  }
}
