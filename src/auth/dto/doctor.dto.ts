import { IsString, IsOptional, IsNotEmpty, MinLength } from 'class-validator';
import {
  ContactInfoWithHashedPasswordDto,
  ContactInfoWithPasswordDto,
  PatientBaseDto,
} from 'src/auth/dto/patient.dto';

class AddressMedicalInstitutionInfoDto {
  @IsString() @IsOptional() apartment: string | null;
  @IsString() @IsNotEmpty() city: string;
  @IsString() @IsNotEmpty() district: string;
  @IsString() @IsNotEmpty() house: string;
  @IsString() @IsOptional() housing: string | null;
  @IsString() @IsNotEmpty() region: string;
  @IsString() @IsNotEmpty() street: string;
}

class EducationMedicalWorkerInfoDto {
  @IsString() @IsNotEmpty() faculty: string;
  @IsString() @IsNotEmpty() licenseNumberMedicalActivities: string;
  @IsString() @IsNotEmpty() nameEducationalInstitution: string;
  @IsString() @IsNotEmpty() numberDiplomaHigherMedicalEducation: string;
  @IsString() @IsNotEmpty() specialistCertificateNumber: string;
  @IsString() @IsNotEmpty() speciality: string;
  @IsString() @IsNotEmpty() specialization: string;
}

class PlaceWorkInfoDto {
  @IsString() @IsNotEmpty() currentSpecialization: string;
  @IsString() @IsNotEmpty() department: string;
  @IsString() @IsNotEmpty() nameMedicalInstitution: string;
}

export class DoctorBaseDto extends PatientBaseDto {
  addressMedicalInstitutionInfo: AddressMedicalInstitutionInfoDto;
  educationMedicalWorkerInfo: EducationMedicalWorkerInfoDto;
  placeWorkInfo: PlaceWorkInfoDto;
}

// REQUEST
// DTO запроса пациента с паролем без вложения в объект user
export class DoctorWithPasswordDto extends DoctorBaseDto {
  @IsNotEmpty()
  contactInfo: ContactInfoWithPasswordDto;
}

// DTO запроса пациента с паролем с вложением в объект user
export class DoctorRequestDto {
  @IsNotEmpty()
  user: DoctorWithPasswordDto;
}

// RESPONSE
// DTO запроса пациента с хешированным паролем без вложения в объект user
export class DoctorWithHashedPasswordDto extends PatientBaseDto {
  @IsNotEmpty()
  contactInfo: ContactInfoWithHashedPasswordDto;
}

// DTO ответа пациента с хэшированным паролем с вложением в объект user
export class DoctorResponseDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  user: DoctorWithHashedPasswordDto;
}
