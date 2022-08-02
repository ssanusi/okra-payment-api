import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RefundsService } from './refunds.service';
import { CreateRefundDto } from './dto/create-refund.dto';
import { UpdateRefundDto } from './dto/update-refund.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PrincipalGuard } from 'src/auth/guard/principal.guard';

@UseGuards(PrincipalGuard)
@Controller('refunds')
export class RefundsController {
  constructor(private readonly refundsService: RefundsService) {}

  @Post()
  create(@Req() req, @Body() createRefundDto: CreateRefundDto) {
    return this.refundsService.create(createRefundDto, req.user);
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.refundsService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.refundsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRefundDto: UpdateRefundDto) {
    return this.refundsService.update(+id, updateRefundDto);
  }
}
