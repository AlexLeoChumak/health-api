import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable, from, switchMap, map, catchError, throwError } from 'rxjs';
import { DoctorEntity } from 'src/repositories/entities/doctor.entity';
import { PatientEntity } from 'src/repositories/entities/patient.entity';
import { getEntityRelationsUtility } from 'src/repositories/utilities/entities-relations.utility';
import { PatientEntityRepository } from 'src/repositories/patient-entity.repository';
import { DoctorEntityRepository } from 'src/repositories/doctor-entity.repository';
import { AUTH_NOTIFICATIONS } from 'src/modules/auth/constants/auth-notification.constant';
import { SensitiveFieldsUserService } from 'src/modules/auth/services/sensitive-fields-user/sensitive-fields-user.service';
import {
  PatientResponseDto,
  DoctorResponseDto,
} from 'src/modules/auth/dto/user-response.dto';

interface DecodedToken {
  sub: string;
  phone: string;
  role: string;
  iat: number;
  exp: number;
}

@Injectable()
export class AccessRefreshTokenService {
  constructor(
    private readonly patientEntityRepository: PatientEntityRepository,
    private readonly doctorEntityRepository: DoctorEntityRepository,
    private readonly jwtService: JwtService,
    private readonly sensitiveFieldsUserService: SensitiveFieldsUserService,
  ) {}

  private createTokenPayload(
    user: PatientEntity | DoctorEntity,
    isPatient: boolean,
  ) {
    return {
      sub: user.id,
      phone: user.mobilePhoneNumberPasswordInfo.mobilePhoneNumber,
      role: isPatient ? 'patient' : 'doctor',
    };
  }

  public generateAccessToken(
    user: PatientEntity | DoctorEntity,
    isPatient: boolean,
  ): string {
    const payload = this.createTokenPayload(user, isPatient);
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }

  public generateRefreshToken(
    user: PatientEntity | DoctorEntity,
    isPatient: boolean,
  ): string {
    const payload = this.createTokenPayload(user, isPatient);
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  private getRepository(
    role: string,
  ): PatientEntityRepository | DoctorEntityRepository {
    return role === 'patient'
      ? this.patientEntityRepository
      : this.doctorEntityRepository;
  }

  public saveRefreshTokenToRepository(
    refreshToken: string,
    userId: string,
  ): Observable<void> {
    return from(
      this.validateToken(refreshToken).pipe(
        switchMap((decoded: DecodedToken) => {
          const repository = this.getRepository(decoded.role);
          const relations = getEntityRelationsUtility(repository);

          return repository.findOneById(userId, relations).pipe(
            switchMap((user) => {
              if (!user) {
                throw new NotFoundException(
                  AUTH_NOTIFICATIONS.USER_NOT_FOUND_ERROR,
                );
              }
              // Глубокое копирование без потери класса
              const updatedUser = Object.assign(
                Object.create(Object.getPrototypeOf(user)), // Создаём объект с тем же прототипом
                structuredClone(user), // Глубокая копия всех данных
                { refreshToken }, // Добавляем новый refreshToken
              );

              return repository.save(updatedUser);
            }),
          );
        }),
        map(() => undefined),
        catchError(() =>
          throwError(() => {
            return AUTH_NOTIFICATIONS.ERROR_SAVING_TOKEN;
          }),
        ),
      ),
    );
  }

  public validateAccessToken(
    accessToken: string,
  ): Observable<PatientResponseDto | DoctorResponseDto> {
    return from(this.validateToken(accessToken)).pipe(
      switchMap((decoded: DecodedToken) => {
        const repository = this.getRepository(decoded.role);
        const relations = getEntityRelationsUtility(repository);

        return repository.findOneById(decoded.sub, relations).pipe(
          map((user) => {
            if (!user) {
              throw new NotFoundException(
                AUTH_NOTIFICATIONS.USER_NOT_FOUND_ERROR,
              );
            }

            return {
              accessToken,
              user: this.sensitiveFieldsUserService.removeSensitiveFieldsFromUser(
                user,
              ),
            };
          }),
        );
      }),
      catchError(() => throwError(() => AUTH_NOTIFICATIONS.TOKEN_EXPIRED)),
    );
  }

  public refreshAccessToken(
    accessToken: string,
  ): Observable<PatientResponseDto | DoctorResponseDto> {
    const decoded = this.jwtService.decode(accessToken) as DecodedToken;

    if (!decoded || !decoded.sub || !decoded.role) {
      throw new NotFoundException(AUTH_NOTIFICATIONS.TOKEN_INVALID);
    }

    const repository = this.getRepository(decoded.role);
    const relations = getEntityRelationsUtility(repository);

    return from(
      repository.findOneById(decoded.sub, relations).pipe(
        switchMap((user) => {
          if (!user || !user.refreshToken) {
            throw new NotFoundException(
              AUTH_NOTIFICATIONS.USER_NOT_FOUND_ERROR,
            );
          }

          return this.validateToken(user.refreshToken).pipe(map(() => user));
        }),
        map((user) => {
          const userType = !('placeWorkInfo' in user);
          const newAccessToken = this.generateAccessToken(user, userType);

          return {
            accessToken: newAccessToken,
            user: this.sensitiveFieldsUserService.removeSensitiveFieldsFromUser(
              user,
            ),
          };
        }),
        catchError(() =>
          throwError(() => AUTH_NOTIFICATIONS.TOKEN_REFRESH_EXPIRED),
        ),
      ),
    );
  }

  private validateToken(token: string): Observable<DecodedToken> {
    return from(this.jwtService.verifyAsync(token)).pipe(
      map((decoded: DecodedToken) => {
        const currentTimestamp = Math.floor(Date.now() / 1000);

        if (decoded.exp <= currentTimestamp) {
          throw new UnauthorizedException();
        }
        return decoded;
      }),
    );
  }
}
