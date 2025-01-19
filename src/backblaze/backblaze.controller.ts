import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Query,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { BackblazeService } from 'src/backblaze/backblaze.service';

@Controller('backblaze')
export class BackblazeController {
  constructor(
    private readonly backblazeService: BackblazeService,
    private readonly logger: Logger,
  ) {}

  @Get('authorize')
  authorize(): Observable<void> {
    return this.backblazeService.authorize();
  }

  @Get('user-photo')
  getPrivatePhotoUrl(
    @Query('bucketId') bucketId: string,
    @Query('fileName') fileName: string,
    @Query('bucketName') bucketName: string,
  ): Observable<string> {
    if (!bucketId || !fileName || !bucketName) {
      throw new HttpException(
        'Missing bucketId or fileName or bucketName',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.backblazeService.getPrivatePhotoUrl(
      bucketId,
      fileName,
      bucketName,
    );
  }
}
