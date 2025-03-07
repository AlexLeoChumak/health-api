import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UpdateResult } from 'typeorm';
import { Observable, from, map, switchMap, throwError } from 'rxjs';
import * as bcrypt from 'bcryptjs';
import { CloudStorageService } from 'src/shared/cloud-storage/cloud-storage.service';
import { PersonalInfoEntityRepository } from 'src/repositories/personal-info-entity.repository';
import { DoctorEntityRepository } from 'src/repositories/doctor-entity.repository';
import { PatientEntityRepository } from 'src/repositories/patient-entity.repository';
import { UpdatePasswordDto } from 'src/modules/user-profile/dto/update-password.dto';
import { MobilePhoneNumberPasswordInfoEntityRepository } from 'src/repositories/mobile-phone-number-password-info-entity.repository';
import { SHARED_CONSTANT } from 'src/shared/constants/shared.constant';
import { USER_PROFILE_CONSTANT } from 'src/modules/user-profile/constants/user-profile.constant';

@Injectable()
export class UserProfileService {
  constructor(
    private readonly configService: ConfigService,
    private readonly cloudStorageService: CloudStorageService,
    private readonly patientEntityRepository: PatientEntityRepository,
    private readonly doctorEntityRepository: DoctorEntityRepository,
    private readonly personalInfoRepository: PersonalInfoEntityRepository,
    private readonly mobilePhoneNumberPasswordInfoRepository: MobilePhoneNumberPasswordInfoEntityRepository,
    private readonly logger: Logger,
  ) {}

  public getPrivatePhotoUrl(
    bucketId: string,
    fileName: string,
    bucketName: string,
  ) {
    return this.cloudStorageService.getPrivatePhotoUrl(
      bucketId,
      fileName,
      bucketName,
    );
  }

  public uploadUserPhoto(
    user: 'patient' | 'doctor',
    userId: string,
    photo: Express.Multer.File,
  ): Observable<UpdateResult> {
    const repository =
      user === 'patient'
        ? this.patientEntityRepository
        : this.doctorEntityRepository;

    return repository.findOneById(userId, ['personalInfo']).pipe(
      switchMap((user) => {
        if (!user || !user.personalInfo) {
          return throwError(
            () => new NotFoundException(SHARED_CONSTANT.USER_NOT_FOUND_ERROR),
          );
        }

        return this.cloudStorageService
          .uploadUserPhoto(
            process.env.BUCKET_ID,
            photo.originalname,
            photo.buffer,
            photo.mimetype,
          )
          .pipe(
            switchMap((uploadResponse) => {
              return from(
                this.personalInfoRepository.update(user.personalInfo.id, {
                  photo: uploadResponse.fileName,
                }),
              );
            }),
          );
      }),
    );
  }

  public updatePassword(updateData: UpdatePasswordDto): Observable<string> {
    const repository =
      updateData.userRole === 'patient'
        ? this.patientEntityRepository
        : this.doctorEntityRepository;

    return repository
      .findOneById(updateData.userId, ['mobilePhoneNumberPasswordInfo'])
      .pipe(
        switchMap((user) => {
          if (!user || !user.mobilePhoneNumberPasswordInfo) {
            return throwError(
              () => new NotFoundException(SHARED_CONSTANT.USER_NOT_FOUND_ERROR),
            );
          }

          return from(
            bcrypt.compare(
              updateData.oldPassword,
              user.mobilePhoneNumberPasswordInfo.hashedPassword,
            ),
          ).pipe(map((isMatch) => ({ user, isMatch })));
        }),
        switchMap(({ user, isMatch }) => {
          if (!isMatch) {
            return throwError(
              () =>
                new BadRequestException(
                  USER_PROFILE_CONSTANT.CURRENT_PASSWORD_INVALID,
                ),
            );
          }

          if (
            !updateData.newPassword ||
            updateData.newPassword !== updateData.newPasswordConfirmation
          ) {
            return throwError(
              () =>
                new BadRequestException(
                  USER_PROFILE_CONSTANT.NEW_PASSWORDS_NO_MATCH,
                ),
            );
          }

          const saltRounds: number = 10;

          return from(bcrypt.hash(updateData.newPassword, saltRounds)).pipe(
            map((hashedPassword) => ({ user, hashedPassword })),
          );
        }),
        switchMap(({ user, hashedPassword }) => {
          return from(
            this.mobilePhoneNumberPasswordInfoRepository.update(
              user.mobilePhoneNumberPasswordInfo.id,
              { hashedPassword },
            ),
          ).pipe(
            map(() => {
              return USER_PROFILE_CONSTANT.PASSWORD_UPDATED_SUCCESSFULLY;
            }),
          );
        }),
      );
  }
}
