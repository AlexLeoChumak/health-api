import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseEntityRepository } from 'src/repositories/base-entity.repository';
import { EducationMedicalWorkerInfoEntity } from 'src/repositories/entities/doctor.entity';

@Injectable()
export class EducationMedicalWorkerInfoEntityRepository extends BaseEntityRepository<EducationMedicalWorkerInfoEntity> {
  constructor(
    @InjectRepository(EducationMedicalWorkerInfoEntity)
    public readonly repository: Repository<EducationMedicalWorkerInfoEntity>,
    public readonly logger: Logger,
  ) {
    super(repository, logger);
  }
}
