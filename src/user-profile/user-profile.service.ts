import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Observable,
  combineLatest,
  switchMap,
  from,
  map,
  catchError,
  throwError,
  tap,
} from 'rxjs';
import { UpdateResult, Repository } from 'typeorm';

import { DoctorEntity } from 'src/auth/entities/doctor.entity';
import { PatientEntity, PersonalInfo } from 'src/auth/entities/patient.entity';
import { B2UploadFileResponseInterface } from 'src/common/models/b2-upload-file-response.interface';
import { CloudStorageService } from 'src/common/services/cloud-storage/cloud-storage.service';
import { GlobalSuccessResponseInterface } from 'src/common/models/global-success-response.interface';
import { USER_PROFILE_NOTIFICATIONS } from 'src/user-profile/constans/user-profile-notification.constant';
import { AUTH_NOTIFICATIONS } from 'src/auth/constants/auth-notification.constant';

@Injectable()
export class UserProfileService {
  logger = new Logger(UserProfileService.name);

  constructor(
    @InjectRepository(PatientEntity)
    private patientRepository: Repository<PatientEntity>,
    @InjectRepository(DoctorEntity)
    private doctorRepository: Repository<DoctorEntity>,
    @InjectRepository(PersonalInfo)
    private personalInfoRepository: Repository<PersonalInfo>,
    private readonly cloudStorageService: CloudStorageService,
    private readonly configService: ConfigService,
  ) {}

  uploadUserPhoto(
    user: 'patient' | 'doctor',
    userId: string,
    photo: Express.Multer.File,
  ): Observable<UpdateResult> {
    const repository: Repository<PatientEntity | DoctorEntity> =
      user === 'patient' ? this.patientRepository : this.doctorRepository;

    const bucketId: string = this.configService.get<string>('BUCKET_ID');
    const fileName: string = `${userId}_${photo.originalname}`;
    const fileBuffer: Buffer = photo.buffer;
    const mimeType: string = photo.mimetype;

    const user$: Observable<PatientEntity | DoctorEntity> =
      this.findUserByIdWithPersonalInfo(repository, userId);

    const upload$: Observable<B2UploadFileResponseInterface> =
      this.uploadPhotoToCloud(bucketId, fileName, fileBuffer, mimeType);

    return combineLatest([user$, upload$]).pipe(
      switchMap(([user, cloudStorageResponse]) => {
        return this.updateUserPhoto(
          user.personalInfo.id,
          cloudStorageResponse.fileId,
        );
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  private findUserByIdWithPersonalInfo(
    repository: Repository<PatientEntity | DoctorEntity>,
    userId: string,
  ): Observable<PatientEntity | DoctorEntity> {
    return from(
      repository.findOne({
        where: { id: userId },
        relations: ['personalInfo'],
      }),
    ).pipe(
      map((user) => {
        if (!user || !user.personalInfo) {
          throw new NotFoundException(
            USER_PROFILE_NOTIFICATIONS.USER_NOT_FOUND_ERROR,
          );
        }
        return user;
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  private uploadPhotoToCloud(
    bucketId: string,
    fileName: string,
    fileBuffer: Buffer,
    mimeType: string,
  ): Observable<B2UploadFileResponseInterface> {
    return this.cloudStorageService
      .uploadFile(bucketId, fileName, fileBuffer, mimeType)
      .pipe(catchError((error) => throwError(() => error)));
  }

  private updateUserPhoto(
    personalInfoId: string,
    fileId: string,
  ): Observable<UpdateResult> {
    return from(
      this.personalInfoRepository.update(personalInfoId, { photo: fileId }),
    ).pipe(catchError((error) => throwError(() => error)));
  }

  downloadUserPhoto(fileId: string): Observable<Buffer> {
    return this.cloudStorageService
      .downloadPrivateFile(fileId)
      .pipe(catchError((error) => throwError(() => error)));
  }
}
