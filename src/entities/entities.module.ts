import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  DoctorEntity,
  AddressMedicalInstitutionInfo,
  EducationMedicalWorkerInfo,
  PlaceWorkInfo,
} from 'src/auth/entities/doctor.entity';
import {
  PatientEntity,
  AddressRegistrationInfo,
  AddressResidenceInfo,
  ContactInfo,
  IdentificationInfo,
  PersonalInfo,
} from 'src/auth/entities/patient.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PatientEntity,
      DoctorEntity,
      AddressRegistrationInfo,
      AddressResidenceInfo,
      ContactInfo,
      IdentificationInfo,
      PersonalInfo,
      AddressMedicalInstitutionInfo,
      EducationMedicalWorkerInfo,
      PlaceWorkInfo,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class EntitiesModule {}
