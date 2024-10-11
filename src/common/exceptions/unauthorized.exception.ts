import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedException extends HttpException {
  constructor(message: string = 'Неавторизованный доступ') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
