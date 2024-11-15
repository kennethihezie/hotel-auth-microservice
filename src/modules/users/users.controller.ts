import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './model/dto/create-user.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { ResponseMessage } from 'microservice-app-library';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@UseGuards(AccessTokenGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  @ResponseMessage('User Created')
  async createUser(@Body() dto: CreateUserDto) {
    return await this.service.createUser(dto);
  }

  @ResponseMessage('Users fetched successfully')
  @Get()
  async getAllUser() {
    return this.service.getAllUser();
  }

  @ResponseMessage('User deleted successfully')
  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    return this.service.deleteUser(id);
  }
}
