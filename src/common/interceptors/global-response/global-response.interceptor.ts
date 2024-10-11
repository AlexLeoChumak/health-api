import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  Logger,
  StreamableFile,
} from '@nestjs/common';
import { Observable, from, of, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import * as fileType from 'file-type';

import { ApiResponseInterface } from 'src/common/models/api-response.interface';
import { UnsupportedMediaTypeException } from 'src/common/exceptions/unsupported-media-type.exception';
import { ProcessingFileTypeException } from 'src/common/exceptions/processing-file-type.exception';

@Injectable()
export class GlobalResponseInterceptor<T> implements NestInterceptor<T> {
  private readonly logger = new Logger(GlobalResponseInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      switchMap((data) => {
        if (data instanceof Buffer || data instanceof Uint8Array) {
          return from(fileType.fromBuffer(data)).pipe(
            map((fileTypeResult) => {
              if (fileTypeResult && fileTypeResult.mime.startsWith('image/')) {
                this.logger.log('Valid image file detected');

                // Использую StreamableFile для отправки файла
                const streamableFile = new StreamableFile(data);

                // Возвращаю файл с установленными заголовками
                context
                  .switchToHttp()
                  .getResponse()
                  .setHeader('Content-Type', fileTypeResult.mime);

                return streamableFile;
              } else {
                this.logger.warn(`Invalid file type: ${fileTypeResult?.mime}`);
                throw new UnsupportedMediaTypeException(
                  `Неподдерживаемый тип файла: ${fileTypeResult?.mime}`,
                );
              }
            }),
            catchError((error) => {
              this.logger.error(`Error processing file type: ${error.message}`);
              throw new ProcessingFileTypeException(
                `Произошла ошибка при обработке типа файла: ${error.message}`,
              );
            }),
          );
        } else {
          // Обработка данных, если это не файл
          this.logger.log('Processing non-file response');
          return of({
            statusCode: data?.statusCode || HttpStatus.OK,
            message: data?.message || 'Операция завершена успешно',
            data: data?.data || data,
          } as ApiResponseInterface<T>);
        }
      }),
      catchError((error: Error) => {
        return throwError(() => error); // Просто пробрасываю оригинальную ошибку
      }),
    );
  }
}
