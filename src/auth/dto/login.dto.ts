import { IsAlphanumeric, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  readonly email: string;

  @IsAlphanumeric()
  readonly password: string;
}
