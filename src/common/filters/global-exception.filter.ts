import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

interface GlobalExceptionResponseInterface {
  message: string;
  // timestamp: new Date().toISOString(),
  // error,
  // statusCode: status,
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    this.logger.error(exception);

    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Универсальная логика извлечения данных из исключения
    const status: number = this.extractStatus(exception);
    const message: string = this.extractMessage(exception);
    // const error: string = this.extractErrorName(exception);

    const responseBody: GlobalExceptionResponseInterface = {
      message,
      // timestamp: new Date().toISOString(),
      // error,
      // statusCode: status,
    };

    // Отправляем ответ через httpAdapter
    httpAdapter.reply(response, responseBody, status);
  }

  private extractStatus(exception: unknown): number {
    // Если это HttpException, используем его статус
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    // Если это объект с полем status, используем его
    if (
      typeof exception === 'object' &&
      exception !== null &&
      'status' in exception
    ) {
      return (exception as any).status || 500;
    }
    // По умолчанию возвращаем статус 500 (Internal Server Error)
    return 500;
  }

  private extractMessage(exception: unknown): string {
    // Если это HttpException, используем его response для извлечения сообщения
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      return typeof response === 'string'
        ? response
        : (response as any)?.message || 'Internal server error';
    }
    // Если это объект с полем message, используем его
    if (
      typeof exception === 'object' &&
      exception !== null &&
      'message' in exception
    ) {
      return (exception as any).message || 'Internal server error';
    }
    // Если это строка, возвращаем её как сообщение
    if (typeof exception === 'string') {
      return exception;
    }
    // По умолчанию возвращаем сообщение "Internal server error"
    return 'Internal server error';
  }

  private extractErrorName(exception: unknown): string {
    // Если это экземпляр Error или наследников, используем имя ошибки
    if (exception instanceof Error) {
      return exception.name;
    }
    // Если это объект с полем error или name, используем их
    if (typeof exception === 'object' && exception !== null) {
      return (
        (exception as any).name || (exception as any).error || 'UnknownError'
      );
    }
    // По умолчанию возвращаем "Unknown error"
    return 'UnknownError';
  }
}
