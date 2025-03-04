import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseEntityRepository } from 'src/repositories/base-entity.repository';
import { PersonalInfoEntity } from 'src/repositories/entities/patient.entity';

@Injectable()
export class PersonalInfoEntityRepository extends BaseEntityRepository<PersonalInfoEntity> {
  constructor(
    @InjectRepository(PersonalInfoEntity)
    public readonly repository: Repository<PersonalInfoEntity>,
    public readonly logger: Logger,
  ) {
    super(repository, logger);
  }
}
