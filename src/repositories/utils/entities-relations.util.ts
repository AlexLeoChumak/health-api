import { PatientEntity } from 'src/repositories/entities/patient.entity';
import {
  PatientEntityRelationType,
  DoctorEntityRelationType,
  PATIENT_ENTITY_RELATIONS,
  DOCTOR_ENTITY_RELATIONS,
} from 'src/repositories/constants/entity-relations.constants';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { REPOSITORY_CONSTANT } from 'src/repositories/constants/repository.constant';

export const getEntityRelationsUtil = <T>(repository: {
  repository: Repository<T>;
}): PatientEntityRelationType[] | DoctorEntityRelationType[] => {
  if (!repository?.repository) {
    throw new BadRequestException(REPOSITORY_CONSTANT.REPOSITORY_MISSING);
  }

  const entityTarget = repository.repository.target;

  return entityTarget === PatientEntity
    ? PATIENT_ENTITY_RELATIONS
    : DOCTOR_ENTITY_RELATIONS;
};
