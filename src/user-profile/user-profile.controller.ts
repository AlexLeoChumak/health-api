import {
  Controller,
  Get,
  Patch,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { UpdateResult } from 'typeorm';

import { UserProfileService } from './user-profile.service';
import { GlobalSuccessResponseInterface } from 'src/common/models/global-success-response.interface';

@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Patch(':user/:id/upload-photo')
  @UseInterceptors(FileInterceptor('photo'))
  uploadUserPhoto(
    @Param('user') user: 'patient' | 'doctor',
    @Param('id') userId: string,
    @UploadedFile() photo: Express.Multer.File,
  ): Observable<GlobalSuccessResponseInterface<UpdateResult>> {
    return this.userProfileService.uploadUserPhoto(user, userId, photo);
  }

  @Get('download-photo/:fileId')
  downloadPhoto(@Param('fileId') fileId: string): Observable<Buffer> {
    return this.userProfileService.downloadUserPhoto(fileId);
  }
}