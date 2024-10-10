import { HttpException, HttpStatus } from '@nestjs/common';

export class RedisCashedTokenException extends HttpException {
  constructor(message: string = 'Redis Error') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
