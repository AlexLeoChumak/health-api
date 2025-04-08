import {
  Controller,
  Patch,
  Param,
  UploadedFile,
  UseInterceptors,
  Get,
  Query,
  Body,
  Logger,
  Put,
  UseGuards,
  Request,
  BadRequestException,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { UpdateResult } from 'typeorm';
import { UserProfileService } from './user-profile.service';
import { UpdatePasswordDto } from 'src/modules/user-profile/dto/update-password.dto';
import { UpdateUserInfoGroupDto } from 'src/modules/user-profile/dto/update-user-info-group.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CustomRequestInterface } from 'src/common/models/custom-request.interface';
import { UserRoleType } from 'src/common/models/user-role.type';
import {
  DoctorBaseResponseDto,
  PatientBaseResponseDto,
} from 'src/modules/auth/dto/user-response.dto';
import { SHARED_CONSTANT } from 'src/common/constants/shared.constant';

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
  ): Observable<PatientBaseResponseDto | DoctorBaseResponseDto> {
    const userDecodedToken = req.userDecodedToken;
    return this.userProfileService.getUserInfo(userDecodedToken);
  }

  @Get('get-photo')
  @UseGuards(JwtAuthGuard)
  getPrivatePhotoUrl(
    @Query('bucketId') bucketId: string,
    @Query('fileName') fileName: string,
    @Query('bucketName') bucketName: string,
  ): Observable<string> {
    if (!bucketId || !fileName || !bucketName) {
      throw new BadRequestException(SHARED_CONSTANT.REQUIRED_DATA_MISSING);
    }

    return this.userProfileService.getPrivatePhotoUrl(
      bucketId,
      fileName,
      bucketName,
    );
  }

  @Patch(':type/:id/upload-photo')
  @UseInterceptors(FileInterceptor('photo'))
  uploadUserPhoto(
    @Param('type') type: UserRoleType,
    @Param('id') userId: string,
    @UploadedFile() photo: Express.Multer.File,
  ): Observable<UpdateResult> {
    return this.userProfileService.uploadUserPhoto(type, userId, photo);
  }

  @Put('update-info-group')
  @UseGuards(JwtAuthGuard)
  updateInfoGroup(
    @Body() updateData: UpdateUserInfoGroupDto,
  ): Observable<string> {
    return this.userProfileService.updateInfoGroup(updateData);
  }

  @Patch('update-password')
  @UseGuards(JwtAuthGuard)
  updatePassword(@Body() updateData: UpdatePasswordDto): Observable<string> {
    return this.userProfileService.updatePassword(updateData);
  }

  @Delete('remove/:type/:id')
  removeUser(
    @Param('id') userId: string,
    @Param('type') type: UserRoleType,
  ): Observable<string> {
    return this.userProfileService.removeUser(userId, type);
  }
}
