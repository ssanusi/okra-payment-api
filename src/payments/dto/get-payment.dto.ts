import { IsMongoId, ValidateIf } from 'class-validator';

export class GetPaymentDto {
  @ValidateIf((o) => o.refund === undefined)
  @IsMongoId()
  payment: string;

  @ValidateIf((o) => o.payment === undefined)
  @IsMongoId()
  refund: string;
}
