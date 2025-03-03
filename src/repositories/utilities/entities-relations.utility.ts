import { PatientEntity } from 'src/repositories/entities/patient.entity';
import {
  PatientEntityRelationType,
  DoctorEntityRelationType,
  PATIENT_ENTITY_RELATIONS,
  DOCTOR_ENTITY_RELATIONS,
} from 'src/repositories/constants/entity-relations.constants';
import { Repository } from 'typeorm';

export function getEntityRelationsUtility<T>(repository: {
  repository: Repository<T>;
}): PatientEntityRelationType[] | DoctorEntityRelationType[] {
  if (!repository?.repository) {
    throw new Error('Invalid repository object');
  }

  const entityTarget = repository.repository.target;

  return entityTarget === PatientEntity
    ? PATIENT_ENTITY_RELATIONS
    : DOCTOR_ENTITY_RELATIONS;
}
