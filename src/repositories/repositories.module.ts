import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorEntityRepository } from 'src/repositories/doctor-entity.repository';
import { PatientEntityRepository } from 'src/repositories/patient-entity.repository';
import { PersonalInfoEntityRepository } from 'src/repositories/personal-info-entity.repository';
import {
  DoctorEntity,
  AddressMedicalInstitutionInfoEntity,
  EducationMedicalWorkerInfoEntity,
  PlaceWorkInfoEntity,
} from 'src/repositories/entities/doctor.entity';
import {
  PatientEntity,
  AddressRegistrationInfoEntity,
  AddressResidenceInfoEntity,
  ContactInfoEntity,
  IdentificationBelarusCitizenInfoEntity,
  IdentificationForeignCitizenInfoEntity,
  PersonalInfoEntity,
  MobilePhoneNumberPasswordInfoEntity,
} from 'src/repositories/entities/patient.entity';
import { MobilePhoneNumberPasswordInfoEntityRepository } from 'src/repositories/mobile-phone-number-password-info-entity.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PatientEntity,
      DoctorEntity,
      AddressRegistrationInfoEntity,
      AddressResidenceInfoEntity,
      ContactInfoEntity,
      IdentificationBelarusCitizenInfoEntity,
      IdentificationForeignCitizenInfoEntity,
      PersonalInfoEntity,
      AddressMedicalInstitutionInfoEntity,
      EducationMedicalWorkerInfoEntity,
      PlaceWorkInfoEntity,
      MobilePhoneNumberPasswordInfoEntity,
    ]),
  ],
  providers: [
    PatientEntityRepository,
    DoctorEntityRepository,
    PersonalInfoEntityRepository,
    MobilePhoneNumberPasswordInfoEntityRepository,
    Logger,
  ],
  exports: [
    TypeOrmModule,
    PatientEntityRepository,
    DoctorEntityRepository,
    PersonalInfoEntityRepository,
    MobilePhoneNumberPasswordInfoEntityRepository,
  ],
})
export class RepositoriesModule {}
