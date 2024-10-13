import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { GlobalResponseInterceptor } from 'src/common/interceptors/global-response/global-response.interceptor';
import { GlobalExceptionFilter } from 'src/common/filters/global-exception.filter';

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

  // ResponseInterceptor
  app.useGlobalInterceptors(new GlobalResponseInterceptor());

  // ExceptionFilter
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapterHost));

  await app.listen(3000);
}
bootstrap();
