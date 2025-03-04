import {
  Controller,
  Patch,
  Param,
  UploadedFile,
  UseInterceptors,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { UpdateResult } from 'typeorm';
import { UserProfileService } from './user-profile.service';

@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get('get-photo')
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

    return this.userProfileService.getPrivatePhotoUrl(
      bucketId,
      fileName,
      bucketName,
    );
  }

  @Patch(':user/:id/upload-photo')
  @UseInterceptors(FileInterceptor('photo'))
  uploadUserPhoto(
    @Param('user') user: 'patient' | 'doctor',
    @Param('id') userId: string,
    @UploadedFile() photo: Express.Multer.File,
  ): Observable<UpdateResult> {
    return this.userProfileService.uploadUserPhoto(user, userId, photo);
  }
}
