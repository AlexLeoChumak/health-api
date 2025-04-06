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
import { AddressMedicalInstitutionInfoEntityRepository } from 'src/repositories/address-medical-institution-info-entity.repository';
import { AddressRegistrationInfoEntityRepository } from 'src/repositories/address-registration-info-entity.repository';
import { AddressResidenceInfoEntityRepository } from 'src/repositories/address-residence-info-entity.repository';
import { ContactInfoEntityRepository } from 'src/repositories/contact-info-entity.repository';
import { EducationMedicalWorkerInfoEntityRepository } from 'src/repositories/education-medical-worker-info-entity.repository';
import { IdentificationBelarusCitizenInfoEntityRepository } from 'src/repositories/identification-belarus-citizen-info-entity.repository';
import { IdentificationForeignCitizenInfoEntityRepository } from 'src/repositories/identification-foreign-citizen-info-entity.repository';
import { PlaceWorkInfoEntityRepository } from 'src/repositories/place-work-info-entity.repository';
import { UserRepositoryService } from 'src/repositories/services/user-repository/user-repository.service';

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
    AddressMedicalInstitutionInfoEntityRepository,
    AddressRegistrationInfoEntityRepository,
    AddressResidenceInfoEntityRepository,
    ContactInfoEntityRepository,
    EducationMedicalWorkerInfoEntityRepository,
    IdentificationBelarusCitizenInfoEntityRepository,
    IdentificationForeignCitizenInfoEntityRepository,
    PlaceWorkInfoEntityRepository,
    UserRepositoryService,
    Logger,
  ],
  exports: [
    TypeOrmModule,
    PatientEntityRepository,
    DoctorEntityRepository,
    PersonalInfoEntityRepository,
    MobilePhoneNumberPasswordInfoEntityRepository,
    AddressMedicalInstitutionInfoEntityRepository,
    AddressRegistrationInfoEntityRepository,
    AddressResidenceInfoEntityRepository,
    ContactInfoEntityRepository,
    EducationMedicalWorkerInfoEntityRepository,
    IdentificationBelarusCitizenInfoEntityRepository,
    IdentificationForeignCitizenInfoEntityRepository,
    PlaceWorkInfoEntityRepository,
    UserRepositoryService,
  ],
})
export class RepositoriesModule {}
