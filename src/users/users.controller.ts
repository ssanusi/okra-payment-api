import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PrincipalGuard } from 'src/auth/guard/principal.guard';

@UseGuards(PrincipalGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res) {
    try {
      const user = await this.usersService.create(createUserDto);
      return res.status(201).json({
        status: 'success',
        message: 'User created Successfully',
        data: user,
      });
    } catch (error) {
      res.status(400).json({ status: 'fail', message: error.message });
    }
  }

  @Get()
  async findAll(@Query() paginationQuery: PaginationQueryDto, @Res() res) {
    try {
      const users = await this.usersService.findAll(paginationQuery);
      return res.status(200).json({
        status: 'success',
        message: 'Users Retrieved Successfully',
        data: users,
      });
    } catch (error) {
      return res.status(400).json({ status: 'fail', message: error.message });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      const user = await this.usersService.findOne(id);
      return res.status(200).json({
        status: 'success',
        message: 'User Retrieved Successfully',
        data: user,
      });
    } catch (error) {
      return res.status(400).json({ status: 'fail', message: error.message });
    }
  }
}
