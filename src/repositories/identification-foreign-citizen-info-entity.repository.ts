import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseEntityRepository } from 'src/repositories/base-entity.repository';
import { IdentificationForeignCitizenInfoEntity } from 'src/repositories/entities/patient.entity';
import { Repository } from 'typeorm';

@Injectable()
export class IdentificationForeignCitizenInfoEntityRepository extends BaseEntityRepository<IdentificationForeignCitizenInfoEntity> {
  constructor(
    @InjectRepository(IdentificationForeignCitizenInfoEntity)
    public readonly repository: Repository<IdentificationForeignCitizenInfoEntity>,
    public readonly logger: Logger,
  ) {
    super(repository, logger);
  }
}
