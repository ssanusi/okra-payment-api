import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { PrincipalGuard } from 'src/auth/guard/principal.guard';

@UseGuards(PrincipalGuard)
@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post()
  async create(@Body() createWalletDto: CreateWalletDto, @Res() res) {
    try {
      const wallet = await this.walletsService.create(createWalletDto);
      return res
        .status(201)
        .json({ status: 'success', message: 'Wallet created', data: wallet });
    } catch (error) {
      res.status(400).json({ status: 'fail', message: error.message });
    }
  }

  @Get()
  async findAllWallets(
    @Query() paginationQuery: PaginationQueryDto,
    @Res() res,
  ) {
    try {
      const wallets = await this.walletsService.findAll(paginationQuery);
      return res.status(200).json({
        status: 'success',
        message: 'wallets retrieved successfully',
        data: wallets,
      });
    } catch (error) {
      res.status(400).json({ status: 'fail', message: error.message });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      const wallet = await this.walletsService.findOne(id);
      return res.status(200).json({
        status: 'success',
        message: 'wallet retrieved successfully',
        data: wallet,
      });
    } catch (error) {
      res.status(400).json({ status: 'fail', message: error.message });
    }
  }

  @Post('/fund')
  async fundWallet(@Body() fundWalletDto: FundWalletDto, @Res() res) {
    try {
      const wallet = await this.walletsService.fundWallet(
        fundWalletDto.walletId,
        fundWalletDto.amount,
      );
      return res
        .status(200)
        .json({ status: 'success', message: 'Wallet funded', data: wallet });
    } catch (error) {
      res.status(400).json({ status: 'fail', message: error.message });
    }
  }
}
