import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Если ошибка типа HttpException, то получаем статус из исключения, иначе — статус 500 (Internal Server Error)
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Формируем тело ответа
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        exception instanceof HttpException
          ? exception.message
          : 'Internal Server Error',
    };

    // Логируем ошибку на сервере
    this.logger.error(
      `HTTP Status: ${status} Error Message: ${JSON.stringify(errorResponse)}`,
      exception instanceof Error ? exception.stack : '',
    );

    // Отправляем ответ клиенту
    response.status(status).json(errorResponse);
  }
}
