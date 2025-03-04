import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UpdateResult } from 'typeorm';
import { Observable, from, switchMap } from 'rxjs';
import { CloudStorageService } from 'src/shared/cloud-storage/cloud-storage.service';
import { PersonalInfoEntityRepository } from 'src/repositories/personal-info-entity.repository';
import { DoctorEntityRepository } from 'src/repositories/doctor-entity.repository';
import { PatientEntityRepository } from 'src/repositories/patient-entity.repository';

@Injectable()
export class UserProfileService {
  constructor(
    private readonly configService: ConfigService,
    private readonly cloudStorageService: CloudStorageService,
    private readonly patientEntityRepository: PatientEntityRepository,
    private readonly doctorEntityRepository: DoctorEntityRepository,
    private readonly personalInfoRepository: PersonalInfoEntityRepository,
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
          throw new NotFoundException('User not found');
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
}
