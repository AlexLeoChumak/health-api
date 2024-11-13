import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  Logger,
  StreamableFile,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { Observable, from, of, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import * as fileType from 'file-type';

import { GlobalSuccessResponseInterface } from 'src/common/models/global-success-response.interface';

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
                // Использую StreamableFile для отправки файла
                const streamableFile = new StreamableFile(data);

                // Возвращаю файл с установленными заголовками
                context
                  .switchToHttp()
                  .getResponse()
                  .setHeader('Content-Type', fileTypeResult.mime);

                return streamableFile;
              } else {
                throw new UnsupportedMediaTypeException(
                  'Неподдерживаемый тип файла',
                );
              }
            }),
            catchError((error: Error) => throwError(() => error)),
          );
        } else {
          // Обработка данных, если обёртка дублируется
          if (
            data &&
            typeof data === 'object' &&
            'statusCode' in data &&
            'message' in data &&
            'data' in data
          ) {
            return of(data);
          }

          // Обработка данных, если они требуют обёртки
          return of({
            statusCode: HttpStatus.OK,
            message: 'Операция завершена успешно',
            data: data,
          } as GlobalSuccessResponseInterface<T>);
        }
      }),
      catchError((error: Error) => throwError(() => error)),
    );
  }
}
