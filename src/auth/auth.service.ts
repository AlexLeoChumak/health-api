import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { AUTH_MESSAGES } from 'src/i18n/ru';
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
      throw new NotFoundException();
    }

    return this.hashPassword(user).pipe(
      map((dataWithHashedPassword) => {
        return repository.create(dataWithHashedPassword);
      }),
      switchMap((entity) => from(repository.save(entity))),
      map((response) => ({
        statusCode: HttpStatus.CREATED,
        message: AUTH_MESSAGES.REGISTRATION_SUCCESS,
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
      throw new BadRequestException('Отсутствует пароль');
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

            return { accessToken, user };
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
    return from(
      repository.findOne({
        where: {
          contactInfo: { mobilePhoneNumber: loginDto?.mobilePhoneNumber },
        },
        relations: ['contactInfo'],
      }),
    ).pipe(
      map((user) => {
        if (!user || !user.personalInfo) {
          throw new NotFoundException('Пользователь не найден');
        }
        return user;
      }),
      catchError((error) => throwError(() => error)),
    );
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
          throw new UnauthorizedException('Неверный логин или пароль');
        }
        return isMatch;
      }),
      catchError((error) => throwError(() => error)),
    );
  }
}
