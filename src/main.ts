import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { config } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  const swaggerConfig = new DocumentBuilder()
  .setTitle('Hotel Auth Microservice')
  .setDescription('Auth Service')
  .setVersion('v1')
  .addBearerAuth(
    {
      description: `Please enter token in following format: Bearer <JWT>`,
      name: 'Authorization',
      bearerFormat: 'Bearer',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    },
    'JWT',
  )
  .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  app.use(helmet());

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });


  await app.listen(3000);
}

bootstrap().then(() => {  
  Logger.log(`
      ------------
      Server Application Started!
      API V1: ${config.app.baseUrl}/
      API Docs: ${config.app.baseUrl}/docs
      Auth Microservice Started Successfully
      ------------
`);
});
