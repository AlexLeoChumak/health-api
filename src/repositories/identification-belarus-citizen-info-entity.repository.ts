import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseEntityRepository } from 'src/repositories/base-entity.repository';
import { IdentificationBelarusCitizenInfoEntity } from 'src/repositories/entities/patient.entity';
import { Repository } from 'typeorm';

@Injectable()
export class IdentificationBelarusCitizenInfoEntityRepository extends BaseEntityRepository<IdentificationBelarusCitizenInfoEntity> {
  constructor(
    @InjectRepository(IdentificationBelarusCitizenInfoEntity)
    public readonly repository: Repository<IdentificationBelarusCitizenInfoEntity>,
    public readonly logger: Logger,
  ) {
    super(repository, logger);
  }
}
