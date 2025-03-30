import { Injectable, Logger } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { DeepPartial, Repository, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export abstract class BaseEntityRepository<T> {
  constructor(
    public readonly repository: Repository<T>,
    public readonly logger: Logger,
  ) {}

  findOneById(userId: string, relations: string[] = []): Observable<T | null> {
    return from(
      this.repository.findOne({ where: { id: userId } as any, relations }),
    );
  }

  findOneByMobilePhoneNumber(
    mobilePhoneNumber: string,
    relations: string[],
  ): Observable<T | null> {
    return from(
      this.repository.findOne({
        where: { mobilePhoneNumberPasswordInfo: { mobilePhoneNumber } } as any,
        relations,
      }),
    );
  }

  create(dto: DeepPartial<T>): T {
    return this.repository.create(dto);
  }

  save(user: T): Observable<T> {
    return from(this.repository.save(user));
  }

  getTargetEntity(): any {
    return this.repository.target;
  }

  update(
    id: string,
    partialEntity: QueryDeepPartialEntity<T>,
  ): Observable<UpdateResult> {
    return from(this.repository.update(id, partialEntity));
  }

  remove(user: T): Observable<T> {
    return from(this.repository.remove(user));
  }
}
