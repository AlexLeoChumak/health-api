import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseEntityRepository } from 'src/repositories/base-entity.repository';
import { AddressResidenceInfoEntity } from 'src/repositories/entities/patient.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AddressResidenceInfoEntityRepository extends BaseEntityRepository<AddressResidenceInfoEntity> {
  constructor(
    @InjectRepository(AddressResidenceInfoEntity)
    public readonly repository: Repository<AddressResidenceInfoEntity>,
    public readonly logger: Logger,
  ) {
    super(repository, logger);
  }
}
