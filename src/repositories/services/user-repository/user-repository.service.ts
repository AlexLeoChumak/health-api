import { Injectable } from '@nestjs/common';
import { DoctorEntityRepository } from 'src/repositories/doctor-entity.repository';
import { PatientEntityRepository } from 'src/repositories/patient-entity.repository';

@Injectable()
export class UserRepositoryService {
  constructor(
    private readonly patientEntityRepository: PatientEntityRepository,
    private readonly doctorEntityRepository: DoctorEntityRepository,
  ) {}

  public getUserRepository(
    userRole: string,
  ): PatientEntityRepository | DoctorEntityRepository {
    return userRole === 'patient'
      ? this.patientEntityRepository
      : this.doctorEntityRepository;
  }
}
