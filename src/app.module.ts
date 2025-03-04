import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { RedisModule } from '@nestjs-modules/ioredis';
import { UserProfileModule } from './modules/user-profile/user-profile.module';
import { RepositoriesModule } from 'src/repositories/repositories.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { validateConfig } from 'src/config/env.config';
import { CloudStorageModule } from 'src/shared/cloud-storage/cloud-storage.module';
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
  PersonalInfoEntity,
  IdentificationBelarusCitizenInfoEntity,
  IdentificationForeignCitizenInfoEntity,
  MobilePhoneNumberPasswordInfoEntity,
} from 'src/repositories/entities/patient.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateConfig,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        entities: [
          PatientEntity,
          DoctorEntity,
          AddressRegistrationInfoEntity,
          AddressResidenceInfoEntity,
          ContactInfoEntity,
          PersonalInfoEntity,
          IdentificationBelarusCitizenInfoEntity,
          IdentificationForeignCitizenInfoEntity,
          AddressMedicalInstitutionInfoEntity,
          EducationMedicalWorkerInfoEntity,
          PlaceWorkInfoEntity,
          MobilePhoneNumberPasswordInfoEntity,
        ],
        synchronize: true,
      }),
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'single',
        url: `redis://${configService.get<string>('REDIS_HOST')}:${configService.get<number>('REDIS_PORT')}`,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserProfileModule,
    RepositoriesModule,
    CloudStorageModule,
  ],
  controllers: [],
})
export class AppModule {}
