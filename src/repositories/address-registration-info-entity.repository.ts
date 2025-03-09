import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseEntityRepository } from 'src/repositories/base-entity.repository';
import { AddressRegistrationInfoEntity } from 'src/repositories/entities/patient.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AddressRegistrationInfoEntityRepository extends BaseEntityRepository<AddressRegistrationInfoEntity> {
  constructor(
    @InjectRepository(AddressRegistrationInfoEntity)
    public readonly repository: Repository<AddressRegistrationInfoEntity>,
    public readonly logger: Logger,
  ) {
    super(repository, logger);
  }
}
