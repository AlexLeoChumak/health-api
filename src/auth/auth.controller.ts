import {
  Controller,
  Post,
  Body,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';

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
import { RegistrationService } from 'src/auth/services/registration.service';
import { LoginService } from 'src/auth/services/login.service';
import { AccessRefreshTokenService } from 'src/auth/services/access-refresh-token.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

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
