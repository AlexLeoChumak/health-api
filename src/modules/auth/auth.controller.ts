import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';

import { GlobalSuccessResponseInterface } from 'src/common/models/global-success-response.interface';
import { LoginRequestDto } from 'src/modules/auth/dto/login-request.dto';
import {
  PatientRequestDto,
  PatientRequestIncludesPasswordDto,
  DoctorRequestDto,
  DoctorRequestIncludesPasswordDto,
} from 'src/modules/auth/dto/user-request.dto';
import {
  PatientResponseDto,
  DoctorResponseDto,
} from 'src/modules/auth/dto/user-response.dto';
import { RegistrationResponseInterface } from 'src/modules/auth/models/registration-response.interface';
import { AccessRefreshTokenService } from 'src/modules/auth/services/access-refresh-token/access-refresh-token.service';
import { LoginService } from 'src/modules/auth/services/login/login.service';
import { RegistrationService } from 'src/modules/auth/services/registration/registration.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registrationService: RegistrationService,
    private readonly loginService: LoginService,
    private readonly accessRefreshTokenService: AccessRefreshTokenService,
  ) {}

  @Post('registration/patient')
  registrationPatient(
    @Body() patientData: PatientRequestDto,
  ): Observable<GlobalSuccessResponseInterface<RegistrationResponseInterface>> {
    const extractData: PatientRequestIncludesPasswordDto = patientData?.user;
    return this.registrationService.registrationPatient(extractData);
  }

  @Post('registration/doctor')
  registrationDoctor(
    @Body() doctorData: DoctorRequestDto,
  ): Observable<GlobalSuccessResponseInterface<RegistrationResponseInterface>> {
    const extractData: DoctorRequestIncludesPasswordDto = doctorData?.user;
    return this.registrationService.registrationDoctor(extractData);
  }

  @Post('login/patient')
  @HttpCode(HttpStatus.OK)
  loginPatient(
    @Body() patientData: LoginRequestDto,
  ): Observable<PatientResponseDto> {
    return this.loginService.loginPatient(patientData);
  }

  @Post('login/doctor')
  @HttpCode(HttpStatus.OK)
  loginDoctor(
    @Body() doctorData: LoginRequestDto,
  ): Observable<DoctorResponseDto> {
    return this.loginService.loginDoctor(doctorData);
  }

  @Post('validate-token')
  validateToken(
    @Body('accessToken') accessToken: string,
  ): Observable<PatientResponseDto | DoctorResponseDto> {
    return this.accessRefreshTokenService.validateAccessToken(accessToken);
  }

  @Post('refresh-token')
  refreshToken(
    @Body('accessToken') accessToken: string,
  ): Observable<PatientResponseDto | DoctorResponseDto> {
    return this.accessRefreshTokenService.refreshAccessToken(accessToken);
  }
}
