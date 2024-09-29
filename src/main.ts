import { NestFactory } from '@nestjs/core';
<<<<<<< HEAD
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from 'src/filters/all-exceptions.filter';
=======
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
>>>>>>> c7cf3c37e01ac14531b57d38f1c2909661d3e5e8

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
<<<<<<< HEAD
  app.useGlobalFilters(new AllExceptionsFilter());
=======
>>>>>>> c7cf3c37e01ac14531b57d38f1c2909661d3e5e8
  await app.listen(3000);
}
bootstrap();
