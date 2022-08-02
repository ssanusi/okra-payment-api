import { IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  readonly amount: number;

  @IsString()
  readonly currency: string;

  @IsString()
  readonly wallet_to_debit: string;

  @IsString()
  readonly wallet_to_credit: string;
}
