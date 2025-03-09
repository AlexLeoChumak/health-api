import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseEntityRepository } from 'src/repositories/base-entity.repository';
import { PlaceWorkInfoEntity } from 'src/repositories/entities/doctor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlaceWorkInfoEntityRepository extends BaseEntityRepository<PlaceWorkInfoEntity> {
  constructor(
    @InjectRepository(PlaceWorkInfoEntity)
    public readonly repository: Repository<PlaceWorkInfoEntity>,
    public readonly logger: Logger,
  ) {
    super(repository, logger);
  }
}
