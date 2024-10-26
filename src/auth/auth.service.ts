import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { DoctorEntity } from 'src/auth/entities/doctor.entity';
import { PatientEntity } from 'src/auth/entities/patient.entity';
import { LoginDto } from 'src/auth/dto/login.dto';
import {
  ContactInfoWithHashedPasswordDto,
  PatientWithHashedPasswordDto,
  PatientWithPasswordtDto,
} from 'src/auth/dto/patient.dto';
import {
  DoctorWithHashedPasswordDto,
  DoctorWithPasswordDto,
} from 'src/auth/dto/doctor.dto';
import { RegistrationUserIdResponseInterface } from 'src/auth/models/registration-user-id-response.interface';
import { LoginAccessTokenUserDataResponseInterface } from 'src/auth/models/login-access-token-userdata-response.interface';
import { GlobalSuccessResponseInterface } from 'src/common/models/global-success-response.interface';
import { AUTH_NOTIFICATIONS } from 'src/auth/constants/auth-notification.constant';
import {
  DOCTOR_ENTITY_RELATIONS,
  DoctorEntityRelationType,
  PATIENT_ENTITY_RELATIONS,
  PatientEntityRelationType,
} from 'src/entities/constants/entities-relations.constants';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(); //позже удалить

  constructor(
    @InjectRepository(PatientEntity)
    private patientRepository: Repository<PatientEntity>,
    @InjectRepository(DoctorEntity)
    private doctorRepository: Repository<DoctorEntity>,
    private readonly jwtService: JwtService,
  ) {}

  registrationPatient(
    patientData: PatientWithPasswordtDto,
  ): Observable<
    GlobalSuccessResponseInterface<RegistrationUserIdResponseInterface>
  > {
    return this.registration(patientData, this.patientRepository);
  }

  registrationDoctor(
    doctorData: DoctorWithPasswordDto,
  ): Observable<
    GlobalSuccessResponseInterface<RegistrationUserIdResponseInterface>
  > {
    return this.registration(doctorData, this.doctorRepository);
  }

  private registration(
    user: PatientWithPasswordtDto | DoctorWithPasswordDto,
    repository: Repository<PatientEntity | DoctorEntity>,
  ): Observable<
    GlobalSuccessResponseInterface<RegistrationUserIdResponseInterface>
  > {
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
        statusCode: HttpStatus.CREATED,
        message: AUTH_NOTIFICATIONS.REGISTRATION_SUCCESS,
        data: { userId: response.id },
      })),
      catchError((error) => {
        this.logger.log(error);
        return throwError(() => error);
      }),
    );
  }

  private hashPassword(
    user: PatientWithPasswordtDto | DoctorWithPasswordDto,
  ): Observable<PatientWithHashedPasswordDto | DoctorWithHashedPasswordDto> {
    if (user?.contactInfo?.password) {
      const saltRounds = 10;

      return from(bcrypt.hash(user.contactInfo.password, saltRounds)).pipe(
        map((hashedPassword) => {
          // Создание нового объекта с зашифрованным паролем
          const updateContactInfo: ContactInfoWithHashedPasswordDto = {
            ...user.contactInfo,
            hashedPassword,
          };

          // Удаление оригинального пароля для обеспечения безопасности
          delete user.contactInfo.password;

          // Возвращение обновленного объекта с удаленным паролем
          return {
            ...user,
            contactInfo: updateContactInfo,
          };
        }),
        catchError((error) => throwError(() => error)),
      );
    } else {
      throw new BadRequestException(
        AUTH_NOTIFICATIONS.REGISTRATION_PASSWORD_NOT_FOUND_ERROR,
      );
    }
  }

  loginPatient(
    patientData: LoginDto,
  ): Observable<LoginAccessTokenUserDataResponseInterface> {
    return this.login(patientData, this.patientRepository);
  }

  loginDoctor(
    doctorData: LoginDto,
  ): Observable<LoginAccessTokenUserDataResponseInterface> {
    return this.login(doctorData, this.doctorRepository);
  }

  private login(
    loginDto: LoginDto,
    repository: Repository<PatientEntity | DoctorEntity>,
  ): Observable<LoginAccessTokenUserDataResponseInterface> {
    return this.findUserByMobilePhoneNumberWithContactInfo(
      loginDto,
      repository,
    ).pipe(
      switchMap((user: PatientEntity | DoctorEntity) => {
        return this.comparePassword(loginDto, user).pipe(
          map(() => {
            const payload = {
              sub: user.id,
              phone: user.contactInfo.mobilePhoneNumber,
            };
            const accessToken = this.jwtService.sign(payload);

            const filteredUserFields =
              this.filterUserFieldsForTransferToClientApp(user);

            return { accessToken, filteredUserFields };
          }),
          catchError((error) => {
            this.logger.log(error);
            return throwError(() => error);
          }),
        );
      }),
    );
  }

  private findUserByMobilePhoneNumberWithContactInfo(
    loginDto: LoginDto,
    repository: Repository<PatientEntity | DoctorEntity>,
  ) {
    const relations: PatientEntityRelationType[] | DoctorEntityRelationType[] =
      repository.target === PatientEntity
        ? PATIENT_ENTITY_RELATIONS
        : DOCTOR_ENTITY_RELATIONS;

    return from(
      repository.findOne({
        where: {
          contactInfo: { mobilePhoneNumber: loginDto?.mobilePhoneNumber },
        },
        relations,
      }),
    ).pipe(
      map((user) => {
        if (!user || !user.contactInfo) {
          throw new NotFoundException(
            AUTH_NOTIFICATIONS.LOGIN_USER_NOT_FOUND_ERROR,
          );
        }

        return user;
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  private filterUserFieldsForTransferToClientApp(
    user: any,
    isRoot: boolean = true,
  ): any {
    if (typeof user !== 'object' || user === null) {
      throw new InternalServerErrorException('Invalid input type');
    }

    const filteredObj: any = {};
    const skipKeys = isRoot ? ['hashedPassword'] : ['id', 'hashedPassword'];

    for (const [key, value] of Object.entries(user)) {
      if (skipKeys.includes(key) || value === undefined || value === null) {
        continue;
      }

      if (typeof value === 'object') {
        const nested = this.filterUserFieldsForTransferToClientApp(
          value,
          false,
        );

        if (nested && Object.keys(nested).length > 0) {
          filteredObj[key] = nested;
        }
      } else {
        filteredObj[key] = value;
      }
    }

    return filteredObj;
  }

  private comparePassword(
    loginDto: LoginDto,
    user: PatientEntity | DoctorEntity,
  ) {
    return from(
      bcrypt.compare(loginDto?.password, user?.contactInfo?.hashedPassword),
    ).pipe(
      map((isMatch) => {
        if (!isMatch) {
          throw new UnauthorizedException(
            AUTH_NOTIFICATIONS.LOGIN_INVALID_PHONE_NUMBER_OR_PASSWORD,
          );
        }
        return isMatch;
      }),
      catchError((error) => throwError(() => error)),
    );
  }
}
