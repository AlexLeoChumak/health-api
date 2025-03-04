import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import * as bcrypt from 'bcryptjs';
import { DoctorEntity } from 'src/repositories/entities/doctor.entity';
import { PatientEntity } from 'src/repositories/entities/patient.entity';
import { GlobalSuccessResponseInterface } from 'src/common/models/global-success-response.interface';
import { DoctorEntityRepository } from 'src/repositories/doctor-entity.repository';
import { PatientEntityRepository } from 'src/repositories/patient-entity.repository';
import { AUTH_NOTIFICATIONS } from 'src/modules/auth/constants/auth-notification.constant';
import { RegistrationResponseInterface } from 'src/modules/auth/models/registration-response.interface';
import {
  PatientRequestIncludesPasswordDto,
  DoctorRequestIncludesPasswordDto,
  PatientRequestIncludesHashedPasswordDto,
  DoctorRequestIncludesHashedPasswordDto,
} from 'src/modules/auth/dto/user-request.dto';

@Injectable()
export class RegistrationService {
  constructor(
    private readonly patientEntityRepository: PatientEntityRepository,
    private readonly doctorEntityRepository: DoctorEntityRepository,
  ) {}

  registrationPatient(
    patientData: PatientRequestIncludesPasswordDto,
  ): Observable<GlobalSuccessResponseInterface<RegistrationResponseInterface>> {
    return this.registration(patientData, this.patientEntityRepository);
  }

  registrationDoctor(
    doctorData: DoctorRequestIncludesPasswordDto,
  ): Observable<GlobalSuccessResponseInterface<RegistrationResponseInterface>> {
    return this.registration(doctorData, this.doctorEntityRepository);
  }

  private registration(
    user: PatientRequestIncludesPasswordDto | DoctorRequestIncludesPasswordDto,
    repository: PatientEntityRepository | DoctorEntityRepository,
  ): Observable<GlobalSuccessResponseInterface<RegistrationResponseInterface>> {
    if (!user) {
      throw new NotFoundException(
        AUTH_NOTIFICATIONS.REGISTRATION_USER_NOT_FOUND_ERROR,
      );
    }

    return this.hashPassword(user).pipe(
      map((dataWithHashedPassword) => {
        if (repository instanceof PatientEntityRepository) {
          return repository.create(
            dataWithHashedPassword as PatientRequestIncludesHashedPasswordDto,
          );
        } else if (repository instanceof DoctorEntityRepository) {
          return repository.create(
            dataWithHashedPassword as DoctorRequestIncludesHashedPasswordDto,
          );
        }
      }),
      switchMap((entity) => {
        if (repository instanceof PatientEntityRepository) {
          return from(repository.save(entity as PatientEntity));
        } else if (repository instanceof DoctorEntityRepository) {
          return from(repository.save(entity as DoctorEntity));
        }
      }),
      map((response) => ({
        message: AUTH_NOTIFICATIONS.REGISTRATION_SUCCESS,
        data: {
          userId: response.id,
          firstName: response.personalInfo.firstName,
        },
      })),
      catchError((err) => {
        return throwError(() => err);
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
