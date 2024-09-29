import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
<<<<<<< HEAD
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AddressRegistrationInfo,
  AddressResidenceInfo,
  ContactInfo,
  IdentificationInfo,
  PatientEntity,
  PersonalInfo,
} from 'src/auth/entities/patient.entity';
import {
  AddressMedicalInstitutionInfo,
  DoctorEntity,
  EducationMedicalWorkerInfo,
  PlaceWorkInfo,
} from 'src/auth/entities/doctor.entity';

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
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
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
        ],
        synchronize: true,
      }),
    }),
    AuthModule,
  ],
=======

@Module({
  imports: [],
>>>>>>> c7cf3c37e01ac14531b57d38f1c2909661d3e5e8
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
