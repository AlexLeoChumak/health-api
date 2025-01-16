import { Repository } from 'typeorm';
import { DoctorEntity } from 'src/auth/entities/doctor.entity';
import { PatientEntity } from 'src/auth/entities/patient.entity';
import {
  PatientEntityRelationType,
  DoctorEntityRelationType,
  PATIENT_ENTITY_RELATIONS,
  DOCTOR_ENTITY_RELATIONS,
} from 'src/entities/constants/entities-relations.constants';

export function getEntityRelationsUtility(
  repository: Repository<PatientEntity | DoctorEntity>,
): PatientEntityRelationType[] | DoctorEntityRelationType[] {
  return repository.target === PatientEntity
    ? PATIENT_ENTITY_RELATIONS
    : DOCTOR_ENTITY_RELATIONS;
}
