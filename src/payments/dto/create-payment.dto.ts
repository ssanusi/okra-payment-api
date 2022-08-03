import {
  IsMongoId,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  readonly amount: number;

  @IsString()
  readonly currency: string;

  @IsMongoId()
  readonly wallet_to_debit: string;

  @IsMongoId()
  readonly wallet_to_credit: string;
}
