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
import { PaymentsService } from './payments.service';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PrincipalGuard } from 'src/auth/guard/principal.guard';

@UseGuards(PrincipalGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Req() req, @Body() createPaymentDto: CreatePaymentDto[]) {
    return this.paymentsService.create(createPaymentDto, req.user);
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.paymentsService.findAll(paginationQuery);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.paymentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(id, updatePaymentDto);
  }
}
