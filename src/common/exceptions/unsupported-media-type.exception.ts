import { HttpException, HttpStatus } from '@nestjs/common';

export class UnsupportedMediaTypeException extends HttpException {
  constructor(message: string = 'Неподдерживаемый тип файла') {
    super(message, HttpStatus.UNSUPPORTED_MEDIA_TYPE);
  }
}
