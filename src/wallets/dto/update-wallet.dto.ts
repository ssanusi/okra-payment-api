import { IsNumber } from 'class-validator';

export class UpdateWalletDto {
  @IsNumber()
  readonly dailyLimit: number;
}
