import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, switchMap, map, catchError, throwError, from } from 'rxjs';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { AUTH_NOTIFICATIONS } from 'src/auth/constants/auth-notification.constant';
import { LoginRequestDto } from 'src/auth/dto/login-request.dto';
import { DoctorEntity } from 'src/auth/entities/doctor.entity';
import { PatientEntity } from 'src/auth/entities/patient.entity';
import {
  PatientResponseDto,
  DoctorResponseDto,
} from 'src/auth/dto/user-response.dto';
import { AccessRefreshTokenService } from 'src/auth/services/access-refresh-token.service';
import { SensitiveFieldsUserService } from 'src/auth/services/sensitive-fields-user.service';
import { getEntityRelationsUtility } from 'src/entities/utils/entities-relations.utility';

@Injectable()
export class LoginService {
  private readonly logger = new Logger(); //позже удалить

  constructor(
    @InjectRepository(PatientEntity)
    private patientRepository: Repository<PatientEntity>,
    @InjectRepository(DoctorEntity)
    private doctorRepository: Repository<DoctorEntity>,
    private readonly accessRefreshTokenService: AccessRefreshTokenService,
    private readonly sensitiveFieldsUserService: SensitiveFieldsUserService,
  ) {}

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
      switchMap((foundUser: PatientEntity | DoctorEntity) => {
        return this.comparePassword(loginDto, foundUser).pipe(
          switchMap(() => {
            const accessToken =
              this.accessRefreshTokenService.generateAccessToken(
                foundUser,
                isPatientRepository,
              );
            const refreshToken =
              this.accessRefreshTokenService.generateRefreshToken(
                foundUser,
                isPatientRepository,
              );

            return this.accessRefreshTokenService
              .saveRefreshTokenToRepository(
                refreshToken,
                foundUser.id,
                repository,
              )
              .pipe(
                map(() => {
                  const user =
                    this.sensitiveFieldsUserService.removeSensitiveFieldsFromUser(
                      foundUser,
                    );

                  return isPatientRepository
                    ? ({
                        accessToken,
                        user,
                      } as PatientResponseDto)
                    : ({
                        accessToken,
                        user,
                      } as DoctorResponseDto);
                }),
              );
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
    const relations = getEntityRelationsUtility(repository);

    return from(
      repository.findOne({
        where: {
          mobilePhoneNumberPasswordInfo: {
            mobilePhoneNumber: loginDto?.mobilePhoneNumber,
          },
        },
        relations,
      }),
    ).pipe(
      map((user) => {
        if (!user || !user.contactInfo) {
          throw new NotFoundException(
            AUTH_NOTIFICATIONS.LOGIN_INVALID_PHONE_NUMBER_OR_PASSWORD_ERROR,
          );
        }

        return user;
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  private comparePassword(
    loginDto: LoginRequestDto,
    user: PatientEntity | DoctorEntity,
  ) {
    return from(
      bcrypt.compare(
        loginDto?.password,
        user?.mobilePhoneNumberPasswordInfo?.hashedPassword,
      ),
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
