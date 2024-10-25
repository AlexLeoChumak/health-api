export type PatientEntityRelationType =
  | 'addressRegistrationInfo'
  | 'addressResidenceInfo'
  | 'contactInfo'
  | 'identificationInfo'
  | 'personalInfo';

export type DoctorEntityRelationType =
  | PatientEntityRelationType
  | 'addressMedicalInstitutionInfo'
  | 'educationMedicalWorkerInfo'
  | 'placeWorkInfo';

export const PATIENT_ENTITY_RELATIONS: PatientEntityRelationType[] = [
  'addressRegistrationInfo',
  'addressResidenceInfo',
  'contactInfo',
  'identificationInfo',
  'personalInfo',
];

export const DOCTOR_ENTITY_RELATIONS: DoctorEntityRelationType[] = [
  ...PATIENT_ENTITY_RELATIONS,
  'addressMedicalInstitutionInfo',
  'educationMedicalWorkerInfo',
  'placeWorkInfo',
];
