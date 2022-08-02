import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDto, @Res() res) {
    const token = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    return res
      .status(200)
      .json({ status: 'success', message: 'Login Successful', data: token });
  }

  @Post('/register')
  async register(@Body() registerDto: RegisterDto, @Res() res) {
    const user = await this.authService.register(registerDto);
    return res
      .status(201)
      .json({ status: 'success', message: 'User created', data: user });
  }
}
