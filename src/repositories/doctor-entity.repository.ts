import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctorEntity } from 'src/repositories/entities/doctor.entity';
import { BaseEntityRepository } from 'src/repositories/base-entity.repository';

@Injectable()
export class DoctorEntityRepository extends BaseEntityRepository<DoctorEntity> {
  constructor(
    @InjectRepository(DoctorEntity)
    public readonly repository: Repository<DoctorEntity>,
    public readonly logger: Logger,
  ) {
    super(repository, logger);
  }
}
