import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { RefundsService } from './refunds.service';
import { CreateRefundDto } from './dto/create-refund.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PrincipalGuard } from 'src/auth/guard/principal.guard';

@UseGuards(PrincipalGuard)
@Controller('refunds')
export class RefundsController {
  constructor(private readonly refundsService: RefundsService) {}

  @Post()
  async create(
    @Req() req,
    @Body() createRefundDto: CreateRefundDto,
    @Res() res,
  ) {
    try {
      const refund = await this.refundsService.create(
        createRefundDto,
        req.user,
      );
      return res
        .status(201)
        .json({ status: 'success', message: 'Refund created', data: refund });
    } catch (error) {}
    return this.refundsService.create(createRefundDto, req.user);
  }

  @Get()
  async findAll(@Query() paginationQuery: PaginationQueryDto, @Res() res) {
    try {
      const refunds = await this.refundsService.findAll(paginationQuery);
      return res.status(200).json({
        status: 'success',
        message: 'refunds retrieved successfully',
        data: refunds,
      });
    } catch (error) {
      res.status(400).json({ status: 'fail', message: error.message });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      const refund = await this.refundsService.findOne(id);
      return res.status(200).json({
        status: 'success',
        message: 'refund retrieved successfully',
        data: refund,
      });
    } catch (error) {
      res.status(400).json({ status: 'fail', message: error.message });
    }
  }
}
