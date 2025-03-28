import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PatientEntity } from 'src/repositories/entities/patient.entity';
import { BaseEntityRepository } from 'src/repositories/base-entity.repository';

@Injectable()
export class PatientEntityRepository extends BaseEntityRepository<PatientEntity> {
  constructor(
    @InjectRepository(PatientEntity)
    public readonly repository: Repository<PatientEntity>,
    public readonly logger: Logger,
  ) {
    super(repository, logger);
  }
}
