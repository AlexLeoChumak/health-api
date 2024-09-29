import { Controller, Post, Body, Res } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Response } from 'express';

import { AuthService } from './auth.service';
<<<<<<< HEAD
import {
  PatientRequestDto,
  PatienWithPasswordtDto,
} from 'src/auth/dto/patient.dto';
import {
  DoctorRequestDto,
  DoctorWithPasswordDto,
} from 'src/auth/dto/doctor.dto';
=======
import { PatientRequestDto } from 'src/auth/dto/patient.dto';
import { DoctorRequestDto } from 'src/auth/dto/doctor.dto';
>>>>>>> c7cf3c37e01ac14531b57d38f1c2909661d3e5e8

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration/patient')
  registrationPatient(
    @Body() patientData: PatientRequestDto,
    @Res() res: Response,
  ): Observable<void> {
<<<<<<< HEAD
    const extractData: PatienWithPasswordtDto = patientData?.user;
=======
    const extractData = patientData?.user;
>>>>>>> c7cf3c37e01ac14531b57d38f1c2909661d3e5e8
    return this.authService.registrationPatient(extractData, res);
  }

  @Post('registration/doctor')
  registrationDoctor(
    @Body() doctorData: DoctorRequestDto,
    @Res() res: Response,
  ): Observable<void> {
<<<<<<< HEAD
    const extractData: DoctorWithPasswordDto = doctorData?.user;
=======
    const extractData = doctorData?.user;
>>>>>>> c7cf3c37e01ac14531b57d38f1c2909661d3e5e8
    return this.authService.registrationDoctor(extractData, res);
  }
}
