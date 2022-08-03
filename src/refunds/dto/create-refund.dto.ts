import { IsMongoId, IsNumber } from 'class-validator';

export class CreateRefundDto {
  @IsMongoId()
  readonly paymentId: string;

  @IsNumber()
  readonly amount: number;
}
