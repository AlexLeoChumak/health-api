import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthorizationB2CloudStorageException extends HttpException {
  constructor(message: string = 'Authorization Error') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
