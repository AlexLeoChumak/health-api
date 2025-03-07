import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseEntityRepository } from 'src/repositories/base-entity.repository';
import { MobilePhoneNumberPasswordInfoEntity } from 'src/repositories/entities/patient.entity';

@Injectable()
export class MobilePhoneNumberPasswordInfoEntityRepository extends BaseEntityRepository<MobilePhoneNumberPasswordInfoEntity> {
  constructor(
    @InjectRepository(MobilePhoneNumberPasswordInfoEntity)
    public readonly repository: Repository<MobilePhoneNumberPasswordInfoEntity>,
    public readonly logger: Logger,
  ) {
    super(repository, logger);
  }
}
