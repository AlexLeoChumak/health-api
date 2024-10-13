import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  Param,
  UploadedFile,
  Logger,
  Patch,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import {
  PatientRequestDto,
  PatienWithPasswordtDto,
} from 'src/auth/dto/patient.dto';
import {
  DoctorRequestDto,
  DoctorWithPasswordDto,
} from 'src/auth/dto/doctor.dto';
import { ApiResponseInterface } from 'src/common/models/api-response.interface';
import { RegistrationUserIdResponseInterface } from 'src/auth/models/registration-user-id-response.interface';
import { LoginAccessTokenUserDataResponseInterface } from 'src/auth/models/login-access-token-userdata-response.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: Logger,
  ) {}

  @Post('registration/patient')
  registrationPatient(
    @Body() patientData: PatientRequestDto,
  ): Observable<ApiResponseInterface<RegistrationUserIdResponseInterface>> {
    const extractData: PatienWithPasswordtDto = patientData?.user;
    return this.authService.registrationPatient(extractData);
  }

  @Post('registration/doctor')
  registrationDoctor(
    @Body() doctorData: DoctorRequestDto,
  ): Observable<ApiResponseInterface<RegistrationUserIdResponseInterface>> {
    const extractData: DoctorWithPasswordDto = doctorData?.user;
    return this.authService.registrationDoctor(extractData);
  }

  @Patch('registration/:user/:id/upload-photo')
  @UseInterceptors(FileInterceptor('photo'))
  uploadUserPhoto(
    @Param('user') user: 'patient' | 'doctor',
    @Param('id') userId: string,
    @UploadedFile() photo: Express.Multer.File,
  ): Observable<ApiResponseInterface<any>> {
    //any
    return this.authService.uploadUserPhoto(user, userId, photo);
  }

  @Get('download-profile-photo/:fileId')
  downloadPhoto(@Param('fileId') fileId: string): Observable<Buffer> {
    return this.authService.downloadUserPhoto(fileId);
  }

  @Post('login/patient')
  loginPatient(
    @Body() patientData: LoginDto,
  ): Observable<LoginAccessTokenUserDataResponseInterface> {
    return this.authService.loginPatient(patientData);
  }

  @Post('login/doctor')
  loginDoctor(
    @Body() doctorData: LoginDto,
  ): Observable<LoginAccessTokenUserDataResponseInterface> {
    return this.authService.loginDoctor(doctorData);
  }
}
