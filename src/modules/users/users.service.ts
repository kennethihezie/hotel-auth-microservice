import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './model/dto/create-user.dto';
import { User } from './model/schema/user.schema';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from '../auth/dto/login.dto';
import { UpdateUserDto } from './model/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UserRepository) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    return this.repository.create({
      ...dto,
      password: await bcrypt.hash(dto.password, 10),
    } as User);
  }

  async validateUser({ email, password }: LoginDto): Promise<User> {
    const user = await this.repository.findOne({ email });
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return user;
  }

  async getUser(_id: string): Promise<User> {
    return await this.repository.findOne({ _id });
  }

  async updateUser(_id: string, payload: UpdateUserDto): Promise<User> {
    const user = await this.repository.findOneAndUpdate({ _id }, payload);
    return user;
  }

  async getAllUser(): Promise<User[]> {
    return await this.repository.find();
  }

  async deleteUser(_id: string): Promise<User> {
    return await this.repository.findOneAndDelete({ _id });
  }
}
