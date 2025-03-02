import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorEntityRepository } from 'src/repositories/doctor-entity.repository';
import {
  AddressMedicalInstitutionInfo,
  DoctorEntity,
  EducationMedicalWorkerInfo,
  PlaceWorkInfo,
} from 'src/repositories/entities/doctor.entity';
import {
  AddressRegistrationInfo,
  AddressResidenceInfo,
  ContactInfo,
  IdentificationBelarusCitizenInfo,
  IdentificationForeignCitizenInfo,
  MobilePhoneNumberPasswordInfo,
  PatientEntity,
  PersonalInfo,
} from 'src/repositories/entities/patient.entity';
import { PatientEntityRepository } from 'src/repositories/patient-entity.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PatientEntity,
      DoctorEntity,
      AddressRegistrationInfo,
      AddressResidenceInfo,
      ContactInfo,
      IdentificationBelarusCitizenInfo,
      IdentificationForeignCitizenInfo,
      PersonalInfo,
      AddressMedicalInstitutionInfo,
      EducationMedicalWorkerInfo,
      PlaceWorkInfo,
      MobilePhoneNumberPasswordInfo,
    ]),
  ],
  providers: [PatientEntityRepository, DoctorEntityRepository, Logger],
  exports: [TypeOrmModule, PatientEntityRepository, DoctorEntityRepository],
})
export class RepositoriesModule {}
