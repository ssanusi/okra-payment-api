import { IsNumber, IsString } from 'class-validator';

export class CreateRefundDto {
  @IsString()
  readonly paymentId: string;

  @IsNumber()
  readonly amount: number;
}
