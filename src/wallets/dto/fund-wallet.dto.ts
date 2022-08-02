import { IsNumber, IsString } from 'class-validator';

export class FundWalletDto {
  @IsString()
  readonly walletId: string;

  @IsNumber()
  readonly amount: number;
}
