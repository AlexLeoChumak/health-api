<<<<<<< HEAD
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  catchError,
  from,
  map,
  Observable,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
=======
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
>>>>>>> c7cf3c37e01ac14531b57d38f1c2909661d3e5e8
import { Repository } from 'typeorm';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

<<<<<<< HEAD
=======
import { DoctorEntity } from 'src/entities/doctor.entity';
import { PatientEntity } from 'src/entities/patient.entity';
>>>>>>> c7cf3c37e01ac14531b57d38f1c2909661d3e5e8
import {
  ContactInfoWithHashedPasswordDto,
  PatientWithHashedPasswordDto,
  PatienWithPasswordtDto,
} from 'src/auth/dto/patient.dto';
import {
  DoctorWithHashedPasswordDto,
  DoctorWithPasswordDto,
} from 'src/auth/dto/doctor.dto';
<<<<<<< HEAD

import { DatabaseException } from 'src/exceptions/database.exception';
import { ValidationException } from 'src/exceptions/validation.exception';
import { AUTH_MESSAGES } from 'src/i18n/ru';
import { DoctorEntity } from 'src/auth/entities/doctor.entity';
import { PatientEntity } from 'src/auth/entities/patient.entity';
=======
import { AUTH_MESSAGES } from 'src/i18n/ru.json';
import { ValidationException } from 'src/exceptions/validation.exception';
import { DatabaseException } from 'src/exceptions/database.exception';
>>>>>>> c7cf3c37e01ac14531b57d38f1c2909661d3e5e8

interface AuthMessageResponseInterface {
  message: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(PatientEntity)
    private patientRepository: Repository<PatientEntity>,
    @InjectRepository(DoctorEntity)
    private doctorRepository: Repository<DoctorEntity>,
<<<<<<< HEAD
    private logger: Logger,
=======
>>>>>>> c7cf3c37e01ac14531b57d38f1c2909661d3e5e8
  ) {}

  private registerEntity<
    T extends PatienWithPasswordtDto | DoctorWithPasswordDto,
  >(
    user: T,
    repository: any,
    res: Response,
    successMessage: string,
  ): Observable<void> {
    if (!user) {
      throw new ValidationException(AUTH_MESSAGES.REGISTRATION_USER_DATA_ERROR);
    }

    return from(this.hashPassword(user)).pipe(
      map((dataWithHashedPassword) =>
        repository.create(dataWithHashedPassword),
      ),
      switchMap((entity) => from(repository.save(entity))),
      map(() => {
        const response: AuthMessageResponseInterface = {
          message: successMessage,
        };
        res.status(HttpStatus.CREATED).json(response);
      }),
<<<<<<< HEAD
      catchError((err) => {
        return throwError(() => this.logger.log(err));
=======
      catchError(() => {
        return throwError(
          () =>
            new DatabaseException(AUTH_MESSAGES.REGISTRATION_DATABASE_ERROR),
        );
>>>>>>> c7cf3c37e01ac14531b57d38f1c2909661d3e5e8
      }),
    );
  }

  private async hashPassword(
    user: PatienWithPasswordtDto | DoctorWithPasswordDto,
  ): Promise<PatientWithHashedPasswordDto | DoctorWithHashedPasswordDto> {
    if (user.contactInfo?.password) {
      try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(
          user.contactInfo.password,
          saltRounds,
        );
        delete user.contactInfo.password;

        const updateContactInfo: ContactInfoWithHashedPasswordDto = {
          ...user.contactInfo,
          hashedPassword,
        };

        return {
          ...user,
          contactInfo: updateContactInfo,
        } as PatientWithHashedPasswordDto | DoctorWithHashedPasswordDto;
      } catch {
        throw new DatabaseException(AUTH_MESSAGES.REGISTRATION_DATABASE_ERROR);
      }
    } else {
      throw new DatabaseException(AUTH_MESSAGES.REGISTRATION_DATABASE_ERROR);
    }
  }

  registrationPatient(
    patientData: PatienWithPasswordtDto,
    res: Response,
  ): Observable<void> {
    return this.registerEntity<PatienWithPasswordtDto>(
      patientData,
      this.patientRepository,
      res,
      AUTH_MESSAGES.REGISTRATION_SUCCESS,
    );
  }

  registrationDoctor(
    doctorData: DoctorWithPasswordDto,
    res: Response,
  ): Observable<void> {
    return this.registerEntity<DoctorWithPasswordDto>(
      doctorData,
      this.doctorRepository,
      res,
      AUTH_MESSAGES.REGISTRATION_SUCCESS,
    );
  }
}
