import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
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
import { CommonModule } from 'src/common/common.module';
import { EntitiesModule } from 'src/entities/entities.module';

@Module({
  imports: [
    EntitiesModule,
    CommonModule,
    JwtModule.register({
      secret: 'interstellar',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, Logger],
})
export class AuthModule {}
