import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import {
  AddressRegistrationInfo,
  AddressResidenceInfo,
  ContactInfo,
  IdentificationInfo,
  MobilePhoneNumberPasswordInfo,
  PatientEntity,
  PersonalInfo,
} from 'src/auth/entities/patient.entity';
import {
  AddressMedicalInstitutionInfo,
  DoctorEntity,
  EducationMedicalWorkerInfo,
  PlaceWorkInfo,
} from 'src/auth/entities/doctor.entity';
import { RedisModule } from '@nestjs-modules/ioredis';
import { UserProfileModule } from './user-profile/user-profile.module';
import { EntitiesModule } from './entities/entities.module';
import { BackblazeModule } from './backblaze/backblaze.module';

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
          IdentificationInfo,
          PersonalInfo,
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
    EntitiesModule,
    BackblazeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
