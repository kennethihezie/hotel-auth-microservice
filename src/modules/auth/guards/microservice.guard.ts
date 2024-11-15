import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../types/jwt-payload.type';
import { AppJwtService } from '../jwt.service';
import { AuthDto } from 'microservice-app-library';

@Injectable()
export class MicroserviceGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private readonly appJwtService: AppJwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rpcRequest = context.switchToRpc();
    const data = rpcRequest.getData();

    const { token } = data as AuthDto;

    if (!token)
      throw new UnauthorizedException(
        'Your are not authorized to access this route',
      );

    const jwtPayload = await this.appJwtService.verifyJwtToken(token);

    const currentUser = await this.validate(token, jwtPayload);

    data.user = currentUser
    
    return true;
  }

  async validate(token: string, payload: JwtPayload) {
    const { sub, email } = payload;

    const user = await this.userService.getUser(sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.token.accessToken !== token) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return user;
  }
}
