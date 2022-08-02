import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
    @Inject(JwtService) private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.validateUser(email, password);
    return {
      access_token: this.jwtService.sign(user),
    };
  }
  async register(user: RegisterDto) {
    return this.usersService.create(user);
  }
}
