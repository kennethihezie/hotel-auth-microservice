import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { Request } from 'express';
import { JwtPayload } from '../types/jwt-payload.type';
import { config } from '../../../config/configuration';
import { AppHelper } from 'microservice-app-library';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwt.jwtSecret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const { sub } = payload;

    const user = await this.userService.getUser(sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // TODO REPLACE WITH METHOD FORM MICROSERVICE APP LIBRARY
    const token = AppHelper.extractTokenFromHeader(req)

    if (user.token.accessToken !== token) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return user;
  }
}
