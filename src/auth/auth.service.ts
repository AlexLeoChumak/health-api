import { HttpStatus, Injectable, Logger, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  catchError,
  from,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { DatabaseException } from 'src/common/exceptions/database.exception';
import { ValidationException } from 'src/common/exceptions/validation.exception';
import { AUTH_MESSAGES } from 'src/i18n/ru';
import { DoctorEntity } from 'src/auth/entities/doctor.entity';
import { PatientEntity, PersonalInfo } from 'src/auth/entities/patient.entity';
import { LoginDto } from 'src/auth/dto/login.dto';
import { UnauthorizedException } from 'src/common/exceptions/unauthorized.exception';
import {
  ContactInfoWithHashedPasswordDto,
  PatientWithHashedPasswordDto,
  PatienWithPasswordtDto,
} from 'src/auth/dto/patient.dto';
import {
  DoctorWithHashedPasswordDto,
  DoctorWithPasswordDto,
} from 'src/auth/dto/doctor.dto';
import { CloudStorageService } from 'src/common/modules/services/cloud-storage/cloud-storage.service';
import { ApiResponseInterface } from 'src/common/models/api-response.interface';
import { RegistrationUserIdResponseInterface } from 'src/auth/models/registration-user-id-response.interface';
import { LoginAccessTokenUserDataResponseInterface } from 'src/auth/models/login-access-token-userdata-response.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(); //позже удалить

  constructor(
    @InjectRepository(PatientEntity)
    private patientRepository: Repository<PatientEntity>,
    @InjectRepository(DoctorEntity)
    private doctorRepository: Repository<DoctorEntity>,
    @InjectRepository(PersonalInfo)
    private personalInfoRepository: Repository<PersonalInfo>,
    private readonly jwtService: JwtService,
    private cloudStorageService: CloudStorageService,
    private configService: ConfigService,
  ) {}

  registrationPatient(
    patientData: PatienWithPasswordtDto,
  ): Observable<ApiResponseInterface<RegistrationUserIdResponseInterface>> {
    return this.registerEntity(patientData, this.patientRepository);
  }

  registrationDoctor(
    doctorData: DoctorWithPasswordDto,
  ): Observable<ApiResponseInterface<RegistrationUserIdResponseInterface>> {
    return this.registerEntity(doctorData, this.doctorRepository);
  }

  private registerEntity(
    user: PatienWithPasswordtDto | DoctorWithPasswordDto,
    repository: Repository<PatientEntity | DoctorEntity>,
  ): Observable<ApiResponseInterface<RegistrationUserIdResponseInterface>> {
    if (!user) {
      throw new ValidationException(AUTH_MESSAGES.REGISTRATION_USER_DATA_ERROR);
    }

    return from(this.hashPassword(user)).pipe(
      map((dataWithHashedPassword) => {
        return repository.create(dataWithHashedPassword);
      }),
      switchMap((entity) => from(repository.save(entity))),
      map((res) => ({
        statusCode: HttpStatus.CREATED,
        message: AUTH_MESSAGES.REGISTRATION_SUCCESS,
        data: { userId: res.id },
      })),
      catchError(() => {
        return throwError(
          () =>
            new DatabaseException(AUTH_MESSAGES.REGISTRATION_DATABASE_ERROR),
        );
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
        };
      } catch {
        throw new DatabaseException(AUTH_MESSAGES.REGISTRATION_DATABASE_ERROR);
      }
    } else {
      throw new DatabaseException(AUTH_MESSAGES.REGISTRATION_DATABASE_ERROR);
    }
  }

  uploadUserPhoto(
    user: 'patient' | 'doctor',
    userId: string,
    photo: Express.Multer.File,
  ): Observable<ApiResponseInterface<any>> {
    const repository =
      user === 'patient' ? this.patientRepository : this.doctorRepository;
    const bucketId = this.configService.get<string>('BUCKET_ID');
    const fileName = `${userId}_${photo.originalname}`;
    const fileBuffer = photo.buffer;
    const mimeType = photo.mimetype;

    return this.cloudStorageService
      .uploadFile(bucketId, fileName, fileBuffer, mimeType)
      .pipe(
        switchMap((responseCloudStorage) => {
          this.logger.log(responseCloudStorage, 'responseCloudStorage');

          // Получаем пользователя с personalInfo
          return from(
            repository.findOne({
              where: { id: userId },
              relations: ['personalInfo'], // Получаем личную информацию
            }),
          ).pipe(
            mergeMap((userIdWithPersonalInfoEntity) => {
              this.logger.log(
                'илона маск foundUser',
                JSON.stringify(userIdWithPersonalInfoEntity),
              );
              // Проверяем, найден ли пользователь
              if (
                !userIdWithPersonalInfoEntity ||
                !userIdWithPersonalInfoEntity.personalInfo
              ) {
                throw new DatabaseException(
                  AUTH_MESSAGES.REGISTRATION_DATABASE_ERROR,
                );
              }

              const IdPersonalInfoEntity =
                userIdWithPersonalInfoEntity.personalInfo.id;

              // Обновляем данные в репозитории
              return from(
                this.personalInfoRepository.update(IdPersonalInfoEntity, {
                  photo: responseCloudStorage.fileId,
                }),
              ).pipe(
                map((res) => ({
                  statusCode: HttpStatus.OK,
                  message: AUTH_MESSAGES.REGISTRATION_SUCCESS,
                  data: res,
                })),
              );
            }),
          );
        }),
        catchError((error) => {
          this.logger.error('Error uploading user photo:', error);
          return throwError(
            () =>
              new DatabaseException(AUTH_MESSAGES.REGISTRATION_DATABASE_ERROR),
          );
        }),
      );
  }

  downloadUserPhoto(fileId: string): Observable<Buffer> {
    return this.cloudStorageService.downloadPrivateFile(fileId);
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

  login(
    loginDto: LoginDto,
    repository: Repository<PatientEntity | DoctorEntity>,
  ): Observable<LoginAccessTokenUserDataResponseInterface> {
    return from(
      repository.findOne({
        where: {
          contactInfo: { mobilePhoneNumber: loginDto?.mobilePhoneNumber },
        },
        relations: ['contactInfo'],
      }),
    ).pipe(
      switchMap((user: PatientEntity | DoctorEntity) => {
        if (!user) {
          throw new UnauthorizedException(
            AUTH_MESSAGES.LOGIN_INVALID_PHONE_NUMBER_OR_PASSWORD,
          );
        }

        // Сравнение пароля с хешем через from(), выполняется промис bcrypt.compare
        return from(
          bcrypt.compare(loginDto?.password, user?.contactInfo?.hashedPassword),
        ).pipe(
          map((isMatch) => {
            if (!isMatch) {
              throw new UnauthorizedException(
                AUTH_MESSAGES.LOGIN_INVALID_PHONE_NUMBER_OR_PASSWORD,
              );
            }

            // Генерация токена, если пароли совпадают
            const payload = {
              sub: user.id,
              phone: user.contactInfo.mobilePhoneNumber,
            };
            const accessToken = this.jwtService.sign(payload);

            return { accessToken, user };
          }),
        );
      }),
      catchError(() =>
        throwError(
          () =>
            new UnauthorizedException(
              AUTH_MESSAGES.LOGIN_INVALID_PHONE_NUMBER_OR_PASSWORD,
            ),
        ),
      ),
    );
  }
}
