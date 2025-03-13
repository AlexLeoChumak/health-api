import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, switchMap, map, catchError, throwError, from } from 'rxjs';
import * as bcrypt from 'bcryptjs';
import { DoctorEntity } from 'src/repositories/entities/doctor.entity';
import { PatientEntity } from 'src/repositories/entities/patient.entity';
import { getEntityRelationsUtility } from 'src/repositories/utilities/entities-relations.utility';
import { DoctorEntityRepository } from 'src/repositories/doctor-entity.repository';
import { PatientEntityRepository } from 'src/repositories/patient-entity.repository';
import { AUTH_NOTIFICATIONS } from 'src/modules/auth/constants/auth-notification.constant';
import { LoginRequestDto } from 'src/modules/auth/dto/login-request.dto';
import { AccessRefreshTokenService } from 'src/modules/auth/services/access-refresh-token/access-refresh-token.service';
import { SensitiveFieldsUserService } from 'src/shared/services/sensitive-fields-user/sensitive-fields-user.service';
import {
  PatientResponseDto,
  DoctorResponseDto,
} from 'src/modules/auth/dto/user-response.dto';

@Injectable()
export class LoginService {
  constructor(
    private readonly patientEntityRepository: PatientEntityRepository,
    private readonly doctorEntityRepository: DoctorEntityRepository,
    private readonly accessRefreshTokenService: AccessRefreshTokenService,
    private readonly sensitiveFieldsUserService: SensitiveFieldsUserService,
  ) {}

  loginPatient(patientData: LoginRequestDto): Observable<PatientResponseDto> {
    return this.login(patientData, this.patientEntityRepository);
  }

  loginDoctor(doctorData: LoginRequestDto): Observable<DoctorResponseDto> {
    return this.login(
      doctorData,
      this.doctorEntityRepository,
    ) as Observable<DoctorResponseDto>;
  }

  private login(
    loginDto: LoginRequestDto,
    repository: PatientEntityRepository | DoctorEntityRepository,
  ): Observable<PatientResponseDto | DoctorResponseDto> {
    const isPatientRepository = repository.getTargetEntity() === PatientEntity;

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
              .saveRefreshTokenToRepository(refreshToken, foundUser.id)
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
            return throwError(() => error);
          }),
        );
      }),
    );
  }

  private findUserByMobilePhoneNumberIncludesRelations(
    loginDto: LoginRequestDto,
    repository: PatientEntityRepository | DoctorEntityRepository,
  ) {
    const relations = getEntityRelationsUtility(repository);

    return repository
      .findOneByMobilePhoneNumber(loginDto?.mobilePhoneNumber, relations)
      .pipe(
        map((user) => {
          if (!user) {
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
