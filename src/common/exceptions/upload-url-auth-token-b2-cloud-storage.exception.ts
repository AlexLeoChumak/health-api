import { HttpException, HttpStatus } from '@nestjs/common';

export class UploadUrlAuthTokenB2CloudStorageException extends HttpException {
  constructor(message: string = 'UploadUrlAuthToken Error') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
