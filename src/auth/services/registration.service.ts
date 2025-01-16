import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { DoctorEntity } from 'src/auth/entities/doctor.entity';
import { PatientEntity } from 'src/auth/entities/patient.entity';
import { GlobalSuccessResponseInterface } from 'src/common/models/global-success-response.interface';
import { AUTH_NOTIFICATIONS } from 'src/auth/constants/auth-notification.constant';
import { RegistrationResponseInterface } from 'src/auth/models/registrationResponse.interface';
import {
  DoctorRequestIncludesHashedPasswordDto,
  DoctorRequestIncludesPasswordDto,
  PatientRequestIncludesHashedPasswordDto,
  PatientRequestIncludesPasswordDto,
} from 'src/auth/dto/user-request.dto';

@Injectable()
export class RegistrationService {
  private readonly logger = new Logger(); //позже удалить

  constructor(
    @InjectRepository(PatientEntity)
    private patientRepository: Repository<PatientEntity>,
    @InjectRepository(DoctorEntity)
    private doctorRepository: Repository<DoctorEntity>,
  ) {}

  registrationPatient(
    patientData: PatientRequestIncludesPasswordDto,
  ): Observable<GlobalSuccessResponseInterface<RegistrationResponseInterface>> {
    return this.registration(patientData, this.patientRepository);
  }

  registrationDoctor(
    doctorData: DoctorRequestIncludesPasswordDto,
  ): Observable<GlobalSuccessResponseInterface<RegistrationResponseInterface>> {
    return this.registration(doctorData, this.doctorRepository);
  }

  private registration(
    user: PatientRequestIncludesPasswordDto | DoctorRequestIncludesPasswordDto,
    repository: Repository<PatientEntity | DoctorEntity>,
  ): Observable<GlobalSuccessResponseInterface<RegistrationResponseInterface>> {
    if (!user) {
      throw new NotFoundException(
        AUTH_NOTIFICATIONS.REGISTRATION_USER_NOT_FOUND_ERROR,
      );
    }

    return this.hashPassword(user).pipe(
      map((dataWithHashedPassword) => {
        return repository.create(dataWithHashedPassword);
      }),
      switchMap((entity) => from(repository.save(entity))),
      map((response) => ({
        message: AUTH_NOTIFICATIONS.REGISTRATION_SUCCESS,
        data: {
          userId: response.id,
          firstName: response.personalInfo.firstName,
        },
      })),
      catchError((error) => {
        this.logger.log(error);
        return throwError(() => error);
      }),
    );
  }

  private hashPassword(
    user: PatientRequestIncludesPasswordDto | DoctorRequestIncludesPasswordDto,
  ): Observable<
    | PatientRequestIncludesHashedPasswordDto
    | DoctorRequestIncludesHashedPasswordDto
  > {
    if (user?.mobilePhoneNumberPasswordInfo?.password) {
      const saltRounds = 10;

      return from(
        bcrypt.hash(user.mobilePhoneNumberPasswordInfo.password, saltRounds),
      ).pipe(
        map((hashedPassword) => {
          // Создание нового объекта с зашифрованным паролем
          const updateMobilePhoneNumberPasswordInfo = {
            ...user.mobilePhoneNumberPasswordInfo,
            hashedPassword,
          };

          // Удаление оригинального пароля для обеспечения безопасности
          delete updateMobilePhoneNumberPasswordInfo.password;

          const updatedUser:
            | PatientRequestIncludesHashedPasswordDto
            | DoctorRequestIncludesHashedPasswordDto = {
            ...user,
            mobilePhoneNumberPasswordInfo: updateMobilePhoneNumberPasswordInfo,
          };

          // Возвращение нового объекта с удаленным паролем и добавленным хешированным паролем
          return updatedUser;
        }),
        catchError((error) => throwError(() => error)),
      );
    } else {
      throw new BadRequestException(
        AUTH_NOTIFICATIONS.REGISTRATION_PASSWORD_NOT_FOUND_ERROR,
      );
    }
  }
}
