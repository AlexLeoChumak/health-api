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
  Body,
  Logger,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { UpdateResult } from 'typeorm';
import { UserProfileService } from './user-profile.service';
import { UpdatePasswordDto } from 'src/modules/user-profile/dto/update-password.dto';
import { UpdateUserInfoGroupDto } from 'src/modules/user-profile/dto/update-user-info-group.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import {
  DoctorResponseDto,
  PatientResponseDto,
} from 'src/modules/auth/dto/user-response.dto';
import { CustomRequestInterface } from 'src/common/models/custom-request.interface';

@Controller('user-profile')
export class UserProfileController {
  constructor(
    private readonly userProfileService: UserProfileService,
    private readonly logger: Logger,
  ) {}

  @Get('get-info')
  @UseGuards(JwtAuthGuard)
  getUserInfo(
    @Request() req: CustomRequestInterface,
  ): PatientResponseDto | DoctorResponseDto {
    const userDecodedToken = req.userDecodedToken;
    return this.userProfileService.getUserInfo(userDecodedToken);
  }

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

  @Patch('update-password')
  updatePassword(@Body() updateData: UpdatePasswordDto): Observable<string> {
    return this.userProfileService.updatePassword(updateData);
  }

  @Put('update-info-group')
  updateInfoGroup(
    @Body() updateData: UpdateUserInfoGroupDto,
  ): Observable<string> {
    return this.userProfileService.updateInfoGroup(updateData);
  }
}
