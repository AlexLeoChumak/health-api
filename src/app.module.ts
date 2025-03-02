import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
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
import {
  AddressMedicalInstitutionInfo,
  DoctorEntity,
  EducationMedicalWorkerInfo,
  PlaceWorkInfo,
} from 'src/repositories/entities/doctor.entity';
import { RedisModule } from '@nestjs-modules/ioredis';
import { UserProfileModule } from './user-profile/user-profile.module';

import { BackblazeModule } from './backblaze/backblaze.module';
import { RepositoriesModule } from 'src/repositories/repositories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
          AddressRegistrationInfo,
          AddressResidenceInfo,
          ContactInfo,
          PersonalInfo,
          IdentificationBelarusCitizenInfo,
          IdentificationForeignCitizenInfo,
          AddressMedicalInstitutionInfo,
          EducationMedicalWorkerInfo,
          PlaceWorkInfo,
          MobilePhoneNumberPasswordInfo,
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
    BackblazeModule,
  ],
  controllers: [],
})
export class AppModule {}
