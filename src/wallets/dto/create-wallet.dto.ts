import { IsNumber, IsString, Matches } from 'class-validator';

export enum CURRENCY {
  NGN,
  USD,
}
export class CreateWalletDto {
  @IsNumber()
  readonly amount: number;

  @IsNumber()
  readonly dailyLimit: number;

  @IsString()
  @Matches(
    `^${Object.values(CURRENCY)
      .filter((v) => typeof v !== 'number')
      .join('|')}$`,
    'i',
  )
  readonly currency: string;

  @IsString()
  readonly owner: string;
}
