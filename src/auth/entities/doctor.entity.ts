import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { PatientEntity } from './patient.entity';

// Сущность для информации о медицинском учреждении
@Entity('address_medical_institution_info')
export class AddressMedicalInstitutionInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  city: string;

  @Column()
  district: string;

  @Column()
  house: number;

  @Column({ nullable: true })
  housing: number | null;

  @Column()
  region: string;

  @Column()
  street: string;
}

// Сущность для информации об образовании медработника
@Entity('education_medical_worker_info')
export class EducationMedicalWorkerInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  faculty: string;

  @Column()
  licenseNumberMedicalActivities: string;

  @Column()
  nameEducationalInstitution: string;

  @Column()
  numberDiplomaHigherMedicalEducation: string;

  @Column()
  specialistCertificateNumber: string;

  @Column()
  speciality: string;

  @Column()
  specialization: string;
}

// Сущность для информации о месте работы медработника
@Entity('place_work_info')
export class PlaceWorkInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nameMedicalInstitution: string;

  @Column()
  department: string;

  @Column()
  currentSpecialization: string;
}

// Сущность Doctor с наследованием от Patient
@Entity('doctors')
export class DoctorEntity extends PatientEntity {
  // Связь с таблицей AddressMedicalInstitutionInfo для информации о медицинском учреждении
  @OneToOne(() => AddressMedicalInstitutionInfo, { cascade: true })
  @JoinColumn({ name: 'addressMedicalInstitutionInfoId' })
  addressMedicalInstitutionInfo: AddressMedicalInstitutionInfo;

  // Связь с таблицей EducationMedicalWorkerInfo для информации об образовании медработника
  @OneToOne(() => EducationMedicalWorkerInfo, { cascade: true })
  @JoinColumn({ name: 'educationMedicalWorkerInfoId' })
  educationMedicalWorkerInfo: EducationMedicalWorkerInfo;

  // Связь с таблицей PlaceWorkInfo для информации о месте работы
  @OneToOne(() => PlaceWorkInfo, { cascade: true })
  @JoinColumn({ name: 'placeWorkInfoId' })
  placeWorkInfo: PlaceWorkInfo;
}
