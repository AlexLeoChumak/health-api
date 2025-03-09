import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseEntityRepository } from 'src/repositories/base-entity.repository';
import { ContactInfoEntity } from 'src/repositories/entities/patient.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContactInfoEntityRepository extends BaseEntityRepository<ContactInfoEntity> {
  constructor(
    @InjectRepository(ContactInfoEntity)
    public readonly repository: Repository<ContactInfoEntity>,
    public readonly logger: Logger,
  ) {
    super(repository, logger);
  }
}
