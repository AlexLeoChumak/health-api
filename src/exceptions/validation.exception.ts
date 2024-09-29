import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor(message: string = 'Validation Error') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
