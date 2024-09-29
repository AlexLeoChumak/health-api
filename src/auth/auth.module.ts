import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import {
  AddressMedicalInstitutionInfo,
  DoctorEntity,
  EducationMedicalWorkerInfo,
  PlaceWorkInfo,
} from 'src/auth/entities/doctor.entity';
import {
  AddressRegistrationInfo,
  AddressResidenceInfo,
  ContactInfo,
  IdentificationInfo,
  PatientEntity,
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
  controllers: [AuthController],
  providers: [AuthService, Logger],
})
export class AuthModule {}
