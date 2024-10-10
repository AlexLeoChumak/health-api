import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from 'src/common/filters/all-exceptions.filter';
import { GlobalResponseInterceptor } from 'src/common/interceptors/global-response/global-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();

  // Установка глобальной валидации DTO (использование ValidationPipe)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Игнорирует дополнительные поля, которых нет в DTO
      forbidNonWhitelisted: true, // Запрещает запросы с дополнительными полями
      transform: true, // Автоматически преобразует типы данных
    }),
  );
  app.useGlobalInterceptors(new GlobalResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(3000);
}
bootstrap();
