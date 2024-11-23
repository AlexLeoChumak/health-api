import {
  Controller,
  Post,
  Body,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { GlobalSuccessResponseInterface } from 'src/common/models/global-success-response.interface';
import {
  DoctorResponseDto,
  PatientResponseDto,
} from 'src/auth/dto/user-response.dto';

import { LoginRequestDto } from 'src/auth/dto/login-request.dto';
import {
  DoctorRequestDto,
  DoctorRequestIncludesPasswordDto,
  PatientRequestDto,
  PatientRequestIncludesPasswordDto,
} from 'src/auth/dto/user-request.dto';
import { RegistrationResponseInterface } from 'src/auth/models/registrationResponse.interface';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('registration/patient')
  registrationPatient(
    @Body() patientData: PatientRequestDto,
  ): Observable<GlobalSuccessResponseInterface<RegistrationResponseInterface>> {
    const extractData: PatientRequestIncludesPasswordDto = patientData?.user;
    return this.authService.registrationPatient(extractData);
  }

  @Post('registration/doctor')
  registrationDoctor(
    @Body() doctorData: DoctorRequestDto,
  ): Observable<GlobalSuccessResponseInterface<RegistrationResponseInterface>> {
    const extractData: DoctorRequestIncludesPasswordDto = doctorData?.user;
    return this.authService.registrationDoctor(extractData);
  }

  @Post('login/patient')
  @HttpCode(HttpStatus.OK)
  loginPatient(
    @Body() patientData: LoginRequestDto,
  ): Observable<PatientResponseDto> {
    return this.authService.loginPatient(patientData);
  }

  @Post('login/doctor')
  @HttpCode(HttpStatus.OK)
  loginDoctor(
    @Body() doctorData: LoginRequestDto,
  ): Observable<DoctorResponseDto> {
    return this.authService.loginDoctor(doctorData);
  }
}
