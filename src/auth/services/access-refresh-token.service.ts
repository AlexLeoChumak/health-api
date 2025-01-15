import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, from, switchMap, map, catchError, throwError } from 'rxjs';

import { AUTH_NOTIFICATIONS } from 'src/auth/constants/auth-notification.constant';
import {
  DoctorResponseDto,
  PatientResponseDto,
} from 'src/auth/dto/user-response.dto';
import { DoctorEntity } from 'src/auth/entities/doctor.entity';
import { PatientEntity } from 'src/auth/entities/patient.entity';
import { SensitiveFieldsUserService } from 'src/auth/services/sensitive-fields-user.service';
import { getEntityRelationsUtility } from 'src/entities/utils/entities-relations.utility';
import { Repository } from 'typeorm';

interface DecodedToken {
  sub: string;
  role: string;
  iat: number;
  exp: number;
}

@Injectable()
export class AccessRefreshTokenService {
  private readonly logger = new Logger(AccessRefreshTokenService.name);

  constructor(
    @InjectRepository(PatientEntity)
    private patientRepository: Repository<PatientEntity>,
    @InjectRepository(DoctorEntity)
    private doctorRepository: Repository<DoctorEntity>,
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
  ): Repository<PatientEntity | DoctorEntity> {
    return role === 'patient' ? this.patientRepository : this.doctorRepository;
  }

  public saveRefreshTokenToRepository(
    refreshToken: string,
    userId: string,
    repository: Repository<PatientEntity | DoctorEntity>,
  ): Observable<void> {
    const relations = getEntityRelationsUtility(repository);

    return from(repository.findOne({ where: { id: userId }, relations })).pipe(
      switchMap((user) => {
        if (!user) {
          throw new NotFoundException(AUTH_NOTIFICATIONS.USER_NOT_FOUND_ERROR);
        }
        const updatedUser = { ...structuredClone(user), refreshToken };
        return from(repository.save(updatedUser));
      }),
      map(() => undefined),
      catchError(() => throwError(() => AUTH_NOTIFICATIONS.ERROR_SAVING_TOKEN)),
    );
  }

  public validateAccessToken(
    accessToken: string,
  ): Observable<PatientResponseDto | DoctorResponseDto> {
    return from(this.validateToken(accessToken)).pipe(
      switchMap((decoded: DecodedToken) => {
        const repository = this.getRepository(decoded.role);
        const relations = getEntityRelationsUtility(repository);

        return from(
          repository.findOne({ where: { id: decoded.sub }, relations }),
        ).pipe(
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
      repository.findOne({ where: { id: decoded.sub }, relations }),
    ).pipe(
      switchMap((user) => {
        if (!user || !user.refreshToken) {
          throw new NotFoundException(AUTH_NOTIFICATIONS.USER_NOT_FOUND_ERROR);
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
