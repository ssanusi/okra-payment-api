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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PrincipalGuard } from 'src/auth/guard/principal.guard';
import { GetPaymentDto } from './dto/get-payment.dto';
import { RefundsService } from 'src/refunds/refunds.service';

@UseGuards(PrincipalGuard)
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly refundsService: RefundsService,
  ) {}

  @Post('/initiate')
  async create(
    @Req() req,
    @Body() createPaymentDto: CreatePaymentDto[],
    @Res() res,
  ) {
    try {
      const payment = await this.paymentsService.create(
        createPaymentDto,
        req.user.userId,
      );
      return res
        .status(201)
        .json({ status: 'success', message: 'Payment created', data: payment });
    } catch (error) {
      res.status(400).json({ status: 'fail', message: error.message });
    }
  }

  @Get('verify')
  async findPayment(@Body() getPayment: GetPaymentDto, @Res() res) {
    try {
      let response;
      if (getPayment.payment) {
        response = await this.paymentsService.findOne(getPayment.payment);
      }

      if (getPayment?.refund) {
        response = await this.refundsService.findOne(getPayment.refund);
      }
      return res.status(200).json({
        status: 'success',
        message: 'Payment Retrieve successfully',
        data: response,
      });
    } catch (error) {
      res.status(400).json({ status: 'fail', message: error.message });
    }
  }

  @Get()
  async findAll(@Query() paginationQuery: PaginationQueryDto, @Res() res) {
    try {
      const payments = await this.paymentsService.findAll(paginationQuery);
      return res.status(200).json({
        status: 'success',
        message: 'Payments Retrieved Successfully',
        data: payments,
      });
    } catch (error) {
      res.status(400).json({ status: 'fail', message: error.message });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      const payment = await this.paymentsService.findOne(id);
      return res.status(200).json({
        status: 'success',
        message: 'Payment Retrieve successfully',
        data: payment,
      });
    } catch (error) {
      res.status(400).json({ status: 'fail', message: error.message });
    }
  }
}
