import { HttpException, HttpStatus } from '@nestjs/common';

export class DatabaseException extends HttpException {
  constructor(message: string = 'Database Error') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
