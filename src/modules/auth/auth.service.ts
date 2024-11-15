import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/model/dto/create-user.dto';
import { User } from '../users/model/schema/user.schema';
import { AppJwtService } from 'microservice-app-library';

@Injectable()
export class AuthService {
  constructor(
    private readonly appJwtService: AppJwtService,
    private readonly userService: UsersService,
  ) {}

  async signUp(payload: CreateUserDto): Promise<User> {
    const user = await this.userService.createUser(payload);
    return user;
  }

  async login(payload: LoginDto): Promise<User> {
    const existingUser = await this.userService.validateUser(payload);

    if(!existingUser) throw new NotFoundException('User not found')

    const { accessToken, refreshToken } = await this.generateUserToken(existingUser)

    const user = await this.userService.updateUser(existingUser._id as string, {
      token: { accessToken, refreshToken },
    });

    return user;
  }

  private async generateUserToken(user: User): Promise<{accessToken: string, refreshToken: string }>{
    const { _id, email } = user

    const accessToken = await this.appJwtService.generateJwtToken({
      sub: _id as unknown as string,
      email: email,
    });

    const refreshToken = await this.appJwtService.generateRefreshToken({
      sub: _id as unknown as string,
    });

    return { accessToken, refreshToken }
  }
}
