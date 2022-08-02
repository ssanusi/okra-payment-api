import { IsAlphanumeric, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @IsString()
  readonly email: string;

  @IsAlphanumeric()
  readonly password: string;
}
