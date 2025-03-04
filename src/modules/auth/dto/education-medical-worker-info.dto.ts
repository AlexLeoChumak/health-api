import { IsString, IsNotEmpty } from 'class-validator';

export class EducationMedicalWorkerInfoDto {
  @IsString() @IsNotEmpty() faculty: string;
  @IsString() @IsNotEmpty() licenseNumberMedicalActivities: string;
  @IsString() @IsNotEmpty() nameEducationalInstitution: string;
  @IsString() @IsNotEmpty() numberDiplomaHigherMedicalEducation: string;
  @IsString() @IsNotEmpty() specialistCertificateNumber: string;
  @IsString() @IsNotEmpty() speciality: string;
  @IsString() @IsNotEmpty() specialization: string;
}
