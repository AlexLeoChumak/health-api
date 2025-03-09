import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseEntityRepository } from 'src/repositories/base-entity.repository';
import { AddressMedicalInstitutionInfoEntity } from 'src/repositories/entities/doctor.entity';

@Injectable()
export class AddressMedicalInstitutionInfoEntityRepository extends BaseEntityRepository<AddressMedicalInstitutionInfoEntity> {
  constructor(
    @InjectRepository(AddressMedicalInstitutionInfoEntity)
    public readonly repository: Repository<AddressMedicalInstitutionInfoEntity>,
    public readonly logger: Logger,
  ) {
    super(repository, logger);
  }
}
