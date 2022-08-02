import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { FundWalletDto } from './dto/fund-wallet.dto';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post()
  create(@Body() createWalletDto: CreateWalletDto) {
    return this.walletsService.create(createWalletDto);
  }

  @Get()
  findAllWallets(@Query() paginationQuery: PaginationQueryDto) {
    return this.walletsService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWalletDto: UpdateWalletDto) {
    return this.walletsService.update(id, updateWalletDto);
  }

  @Post('/fund')
  fundWallet(@Body() fundWalletDto: FundWalletDto) {
    return this.walletsService.fundWallet(
      fundWalletDto.walletId,
      fundWalletDto.amount,
    );
  }
}
