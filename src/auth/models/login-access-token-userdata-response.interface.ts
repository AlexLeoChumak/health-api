import { DoctorEntity } from 'src/auth/entities/doctor.entity';
import { PatientEntity } from 'src/auth/entities/patient.entity';

export interface LoginAccessTokenUserDataResponseInterface {
  accessToken: string;
  user: PatientEntity | DoctorEntity;
}
