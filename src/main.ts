import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  const port = configService.get<number>('PORT') || 3000;
  const host = configService.get<string>('HOST') || 'localhost';

  app.setGlobalPrefix('api/v1');
  
  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.enableCors({
    
  });

  const config = new DocumentBuilder()
    .setTitle('OnlyArts API') 
    .setDescription('The OnlyArts API Documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port, host);

  logger.log(`🚀 Application is running on: http://${host}:${port}`);
  logger.log(`📚 Swagger documentation: http://${host}:${port}/api/docs`);
}
void bootstrap();
