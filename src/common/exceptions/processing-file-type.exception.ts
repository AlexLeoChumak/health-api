import { HttpException, HttpStatus } from '@nestjs/common';

export class ProcessingFileTypeException extends HttpException {
  constructor(message: string = 'Произошла ошибка при обработке типа файла') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
