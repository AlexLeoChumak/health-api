import { Controller, Post, Body, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import {
  PatientRequestDto,
  PatientWithPasswordtDto,
} from 'src/auth/dto/patient.dto';
import {
  DoctorRequestDto,
  DoctorWithPasswordDto,
} from 'src/auth/dto/doctor.dto';
import { RegistrationUserIdResponseInterface } from 'src/auth/models/registration-user-id-response.interface';
import { LoginAccessTokenUserDataResponseInterface } from 'src/auth/models/login-access-token-userdata-response.interface';
import { GlobalSuccessResponseInterface } from 'src/common/models/global-success-response.interface';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('registration/patient')
  registrationPatient(
    @Body() patientData: PatientRequestDto,
  ): Observable<
    GlobalSuccessResponseInterface<RegistrationUserIdResponseInterface>
  > {
    const extractData: PatientWithPasswordtDto = patientData?.user;
    return this.authService.registrationPatient(extractData);
  }

  @Post('registration/doctor')
  registrationDoctor(
    @Body() doctorData: DoctorRequestDto,
  ): Observable<
    GlobalSuccessResponseInterface<RegistrationUserIdResponseInterface>
  > {
    const extractData: DoctorWithPasswordDto = doctorData?.user;
    return this.authService.registrationDoctor(extractData);
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
