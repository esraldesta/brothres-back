import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './execption.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const configService = app.get(ConfigService);
  const port = configService.get<number | string>('PORT') || 8000;
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(port);
  app.useGlobalFilters(new HttpExceptionFilter());
}
bootstrap();