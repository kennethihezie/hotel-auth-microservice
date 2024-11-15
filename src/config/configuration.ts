import { ConfigService } from '@nestjs/config';

const configService: ConfigService = new ConfigService();

export const config = {
  app: {
    port: configService.get<number>('PORT'),
    baseUrl: configService.get<string>('BASE_URL'),
  },
  jwt: {
    jwtSecret: configService.get<string>('JWT_SECRET'),
    jwtRefreshSecret: configService.get<string>('JWT_REFRESH_SECRET'),
    jwtExpiresIn: configService.get<number>('JWT_EXPIRES'),
    jwtRefreshExpiresIn: configService.get<number>('JWT_REFRESH_EXPIRES'),
  },
  rabbitMq: {
    url: configService.get<number>('RABBIT_MQ_URI'),
  },
};
