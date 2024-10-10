import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Observable, of, from } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Response } from 'express';
import * as fileType from 'file-type';
import { ApiResponseInterface } from 'src/common/models/api-response.interface';

@Injectable()
export class GlobalResponseInterceptor<T> implements NestInterceptor<T, any> {
  private readonly logger = new Logger(GlobalResponseInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      switchMap((data) => {
        // Проверка, является ли входное значение Buffer или Uint8Array
        if (data instanceof Buffer || data instanceof Uint8Array) {
          // Преобразуем асинхронную операцию `fileType.fromBuffer` в Observable
          return from(fileType.fromBuffer(data)).pipe(
            map((fileTypeResult) => {
              if (fileTypeResult && fileTypeResult.mime.startsWith('image/')) {
                this.logger.log('Valid image file detected');
                response.set({
                  'Content-Type': fileTypeResult.mime,
                });
                response.end(data);
                return; // Завершаем поток, так как ответ уже отправлен
              } else {
                this.logger.warn(`Invalid file type: ${fileTypeResult?.mime}`);
                response.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).json({
                  statusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                  message: 'Unsupported file type',
                });
                return; // Завершаем поток
              }
            }),
            catchError((err) => {
              this.logger.error(`Error processing file type: ${err.message}`);
              response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while processing the file type',
              });
              return of(undefined); // Возвращаем пустое значение для корректной работы pipe
            }),
          );
        } else {
          // Обработка случаев, когда data не является Buffer или Uint8Array
          this.logger.log('Processing non-file response');
          response.status(data?.statusCode || HttpStatus.OK);
          return of({
            statusCode: data?.statusCode || HttpStatus.OK,
            message: data?.message || 'Операция завершена успешно',
            data: data?.data || data,
          } as ApiResponseInterface<T>); // Возвращаем ApiResponseInterface
        }
      }),
      catchError((err) => {
        this.logger.error(`Error processing response: ${err.message}`);
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An error occurred while processing the response',
        });
        return of(undefined); // Возвращаем пустое значение для корректной работы pipe
      }),
    );
  }
}
