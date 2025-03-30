import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository, UpdateResult } from 'typeorm';
import { Observable, from, map, of, switchMap, throwError } from 'rxjs';
import * as bcrypt from 'bcryptjs';
import { CloudStorageService } from 'src/shared/modules/cloud-storage/cloud-storage.service';
import { PersonalInfoEntityRepository } from 'src/repositories/personal-info-entity.repository';
import { DoctorEntityRepository } from 'src/repositories/doctor-entity.repository';
import { PatientEntityRepository } from 'src/repositories/patient-entity.repository';
import { UpdatePasswordDto } from 'src/modules/user-profile/dto/update-password.dto';
import { MobilePhoneNumberPasswordInfoEntityRepository } from 'src/repositories/mobile-phone-number-password-info-entity.repository';
import { SHARED_CONSTANT } from 'src/common/constants/shared.constant';
import { USER_PROFILE_CONSTANT } from 'src/modules/user-profile/constants/user-profile.constant';
import { UpdateUserInfoGroupDto } from 'src/modules/user-profile/dto/update-user-info-group.dto';
import { AddressMedicalInstitutionInfoEntityRepository } from 'src/repositories/address-medical-institution-info-entity.repository';
import { AddressRegistrationInfoEntityRepository } from 'src/repositories/address-registration-info-entity.repository';
import { AddressResidenceInfoEntityRepository } from 'src/repositories/address-residence-info-entity.repository';
import { ContactInfoEntityRepository } from 'src/repositories/contact-info-entity.repository';
import { EducationMedicalWorkerInfoEntityRepository } from 'src/repositories/education-medical-worker-info-entity.repository';
import { IdentificationBelarusCitizenInfoEntityRepository } from 'src/repositories/identification-belarus-citizen-info-entity.repository';
import { IdentificationForeignCitizenInfoEntityRepository } from 'src/repositories/identification-foreign-citizen-info-entity.repository';
import { PlaceWorkInfoEntityRepository } from 'src/repositories/place-work-info-entity.repository';
import { UpdateUserInfoGroupType } from 'src/modules/user-profile/models/update-user-info-group.type';
import { getEntityRelationsUtil } from 'src/repositories/utils/entities-relations.util';
import { DecodedAccessRefreshTokenInterface } from 'src/common/models/decoded-access-refresh-token.interface';
import { SensitiveFieldsUserService } from 'src/shared/services/sensitive-fields-user/sensitive-fields-user.service';
import { UserRoleType } from 'src/common/models/user-role.type';
import {
  DoctorBaseResponseDto,
  PatientBaseResponseDto,
} from 'src/modules/auth/dto/user-response.dto';
import { PatientEntity } from 'src/repositories/entities/patient.entity';
import { DoctorEntity } from 'src/repositories/entities/doctor.entity';

@Injectable()
export class UserProfileService {
  constructor(
    private readonly configService: ConfigService,
    private readonly cloudStorageService: CloudStorageService,
    private readonly sensitiveFieldsUserService: SensitiveFieldsUserService,
    private readonly patientEntityRepository: PatientEntityRepository,
    private readonly doctorEntityRepository: DoctorEntityRepository,
    private readonly personalInfoRepository: PersonalInfoEntityRepository,
    private readonly mobilePhoneNumberPasswordInfoRepository: MobilePhoneNumberPasswordInfoEntityRepository,
    private readonly addressMedicalInstitutionInfoEntityRepository: AddressMedicalInstitutionInfoEntityRepository,
    private readonly addressRegistrationInfoEntityRepository: AddressRegistrationInfoEntityRepository,
    private readonly addressResidenceInfoEntityRepository: AddressResidenceInfoEntityRepository,
    private readonly contactInfoEntityRepository: ContactInfoEntityRepository,
    private readonly educationMedicalWorkerInfoEntityRepository: EducationMedicalWorkerInfoEntityRepository,
    private readonly identificationBelarusCitizenInfoEntityRepository: IdentificationBelarusCitizenInfoEntityRepository,
    private readonly identificationForeignCitizenInfoEntityRepository: IdentificationForeignCitizenInfoEntityRepository,
    private readonly placeWorkInfoEntityRepository: PlaceWorkInfoEntityRepository,
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
    type: UserRoleType,
    userId: string,
    photo: Express.Multer.File,
  ): Observable<UpdateResult> {
    const repository = this.getUserRepository(type);

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
                  photoId: uploadResponse.fileId,
                }),
              );
            }),
          );
      }),
    );
  }

  public updateInfoGroup(
    updateData: UpdateUserInfoGroupDto,
  ): Observable<string> {
    const repository = this.getUserRepository(updateData.userRole);
    const keyName = Object.keys(updateData.updateInfoGroup)[0];
    const isPersonalInfoGroup = keyName === 'personalInfo';

    return repository.findOneById(updateData.userId, [keyName]).pipe(
      switchMap((user) => {
        if (!user || !user[keyName]) {
          return throwError(
            () => new NotFoundException(SHARED_CONSTANT.USER_NOT_FOUND_ERROR),
          );
        }

        const infoGroupId = user[keyName]?.id;
        const infoGroupRepository = this.getInfoGroupRepository(keyName);

        return from(
          infoGroupRepository.update(
            infoGroupId,
            updateData.updateInfoGroup[keyName],
          ),
        ).pipe(
          switchMap((result) => {
            if (result.affected === 0) {
              return throwError(
                () =>
                  new NotFoundException(
                    USER_PROFILE_CONSTANT.INFO_GROUP_NOT_FOUND,
                  ),
              );
            }

            const userData = updateData.updateInfoGroup[keyName];

            if (isPersonalInfoGroup && userData.photo) {
              return this.cloudStorageService.deletePhoto(
                updateData.currentUserPhotoData.name,
                updateData.currentUserPhotoData.id,
              );
            }

            return of(null); // Чтобы цепочка не прерывалась, если if не сработает
          }),
          map(() => {
            return USER_PROFILE_CONSTANT.INFO_GROUP_UPDATED_SUCCESSFULLY;
          }),
        );
      }),
    );
  }

  private getInfoGroupRepository(
    keyName: string,
  ): Repository<UpdateUserInfoGroupType> {
    const repositoriesMap = {
      personalInfo: this.personalInfoRepository,
      mobilePhoneNumberPasswordInfo:
        this.mobilePhoneNumberPasswordInfoRepository,
      addressMedicalInstitutionInfo:
        this.addressMedicalInstitutionInfoEntityRepository,
      addressRegistrationInfo: this.addressRegistrationInfoEntityRepository,
      addressResidenceInfo: this.addressResidenceInfoEntityRepository,
      contactInfo: this.contactInfoEntityRepository,
      educationMedicalWorkerInfo:
        this.educationMedicalWorkerInfoEntityRepository,
      identificationBelarusCitizenInfo:
        this.identificationBelarusCitizenInfoEntityRepository,
      identificationForeignCitizenInfo:
        this.identificationForeignCitizenInfoEntityRepository,
      placeWorkInfo: this.placeWorkInfoEntityRepository,
    };

    const repository = repositoriesMap[keyName];
    if (!repository) {
      throw new NotFoundException(USER_PROFILE_CONSTANT.REPOSITORY_NOT_FOUND);
    }

    return repository;
  }

  public getUserInfo(
    userDecodedToken: DecodedAccessRefreshTokenInterface,
  ): Observable<PatientBaseResponseDto | DoctorBaseResponseDto> {
    const repository = this.getUserRepository(userDecodedToken.role);
    const relations = getEntityRelationsUtil(repository);

    return from(repository.findOneById(userDecodedToken.sub, relations)).pipe(
      switchMap((user) => {
        if (!user) {
          return throwError(
            () => new NotFoundException(SHARED_CONSTANT.USER_NOT_FOUND_ERROR),
          );
        }

        return of(
          this.sensitiveFieldsUserService.removeSensitiveFieldsFromUser(user),
        );
      }),
    );
  }

  public updatePassword(updateData: UpdatePasswordDto): Observable<string> {
    const repository = this.getUserRepository(updateData.userRole);

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

  public removeUser(userId: string, type: UserRoleType): Observable<string> {
    if (!userId) {
      throw new NotFoundException(SHARED_CONSTANT.REQUIRED_DATA_MISSING);
    }

    const repository = this.getUserRepository(type);
    const relations = getEntityRelationsUtil(repository);

    return from(repository.findOneById(userId, relations)).pipe(
      switchMap((user) => {
        if (!user) {
          return throwError(
            () => new NotFoundException(SHARED_CONSTANT.USER_NOT_FOUND_ERROR),
          );
        }

        if (repository instanceof PatientEntityRepository) {
          return from(repository.remove(user as PatientEntity));
        } else if (repository instanceof DoctorEntityRepository) {
          return from(repository.remove(user as DoctorEntity));
        }
      }),
      map(() => {
        return USER_PROFILE_CONSTANT.USER_DELETE_SUCCESS;
      }),
    );
  }

  private getUserRepository(
    userRole: string,
  ): PatientEntityRepository | DoctorEntityRepository {
    return userRole === 'patient'
      ? this.patientEntityRepository
      : this.doctorEntityRepository;
  }
}
