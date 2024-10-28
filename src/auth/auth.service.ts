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

import { RegistrationUserIdResponseInterface } from 'src/auth/models/registration-user-id-response.interface';
import { GlobalSuccessResponseInterface } from 'src/common/models/global-success-response.interface';
import { AUTH_NOTIFICATIONS } from 'src/auth/constants/auth-notification.constant';
import {
  DOCTOR_ENTITY_RELATIONS,
  DoctorEntityRelationType,
  PATIENT_ENTITY_RELATIONS,
  PatientEntityRelationType,
} from 'src/entities/constants/entities-relations.constants';
import {
  DoctorBaseResponseDto,
  DoctorResponseDto,
  PatientResponseDto,
  UserBaseResponseDto,
} from 'src/auth/dto/user-response.dto';
import { LoginRequestDto } from 'src/auth/dto/login-request.dto';
import {
  DoctorRequestIncludesHashedPasswordDto,
  DoctorRequestIncludesPasswordDto,
  PatientRequestIncludesHashedPasswordDto,
  PatientRequestIncludesPasswordDto,
} from 'src/auth/dto/user-request.dto';

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
    patientData: PatientRequestIncludesPasswordDto,
  ): Observable<
    GlobalSuccessResponseInterface<RegistrationUserIdResponseInterface>
  > {
    return this.registration(patientData, this.patientRepository);
  }

  registrationDoctor(
    doctorData: DoctorRequestIncludesPasswordDto,
  ): Observable<
    GlobalSuccessResponseInterface<RegistrationUserIdResponseInterface>
  > {
    return this.registration(doctorData, this.doctorRepository);
  }

  private registration(
    user: PatientRequestIncludesPasswordDto | DoctorRequestIncludesPasswordDto,
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
    user: PatientRequestIncludesPasswordDto | DoctorRequestIncludesPasswordDto,
  ): Observable<
    | PatientRequestIncludesHashedPasswordDto
    | DoctorRequestIncludesHashedPasswordDto
  > {
    if (user?.contactInfo?.password) {
      const saltRounds = 10;

      return from(bcrypt.hash(user.contactInfo.password, saltRounds)).pipe(
        map((hashedPassword) => {
          // Создание нового объекта с зашифрованным паролем
          const updateContactInfo = {
            ...user.contactInfo,
            hashedPassword,
          };

          // Удаление оригинального пароля для обеспечения безопасности
          delete updateContactInfo.password;

          const updatedUser:
            | PatientRequestIncludesHashedPasswordDto
            | DoctorRequestIncludesHashedPasswordDto = {
            ...user,
            contactInfo: updateContactInfo,
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

  loginPatient(patientData: LoginRequestDto): Observable<PatientResponseDto> {
    return this.login(patientData, this.patientRepository);
  }

  loginDoctor(doctorData: LoginRequestDto): Observable<DoctorResponseDto> {
    return this.login(
      doctorData,
      this.doctorRepository,
    ) as Observable<DoctorResponseDto>;
  }

  private login(
    loginDto: LoginRequestDto,
    repository: Repository<PatientEntity | DoctorEntity>,
  ): Observable<PatientResponseDto | DoctorResponseDto> {
    const isPatientRepository =
      repository instanceof Repository && repository.target === PatientEntity;

    return this.findUserByMobilePhoneNumberIncludesRelations(
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

            const userDataResponse =
              this.filterUserFieldsForTransferToClientApp(user);

            return isPatientRepository
              ? ({ accessToken, userDataResponse } as PatientResponseDto)
              : ({ accessToken, userDataResponse } as DoctorResponseDto);
          }),
          catchError((error) => {
            this.logger.log(error);
            return throwError(() => error);
          }),
        );
      }),
    );
  }

  private findUserByMobilePhoneNumberIncludesRelations(
    loginDto: LoginRequestDto,
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
    user: PatientEntity | DoctorEntity,
    isRoot: boolean = true,
  ): UserBaseResponseDto | DoctorBaseResponseDto {
    if (typeof user !== 'object') {
      throw new InternalServerErrorException(
        AUTH_NOTIFICATIONS.LOGIN_USER_NOT_FOUND_ERROR,
      );
    }

    const filteredObj = {};
    const skipFields = isRoot ? ['hashedPassword'] : ['id', 'hashedPassword'];

    for (const [field, value] of Object.entries(user)) {
      if (skipFields.includes(field) || value === undefined) {
        continue;
      }

      if (typeof value === 'object' && value !== null) {
        const nested = this.filterUserFieldsForTransferToClientApp(
          value,
          false,
        );

        if (nested && Object.keys(nested).length > 0) {
          filteredObj[field] = nested;
        }
      } else {
        filteredObj[field] = value;
      }
    }

    return filteredObj as UserBaseResponseDto | DoctorBaseResponseDto;
  }

  private comparePassword(
    loginDto: LoginRequestDto,
    user: PatientEntity | DoctorEntity,
  ) {
    return from(
      bcrypt.compare(loginDto?.password, user?.contactInfo?.hashedPassword),
    ).pipe(
      map((isMatch) => {
        if (!isMatch) {
          throw new UnauthorizedException(
            AUTH_NOTIFICATIONS.LOGIN_INVALID_PHONE_NUMBER_OR_PASSWORD_ERROR,
          );
        }
        return isMatch;
      }),
      catchError((error) => throwError(() => error)),
    );
  }
}
