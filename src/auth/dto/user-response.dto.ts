import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

import { AddressInfoDto } from 'src/auth/dto/address-info.dto';
import { AddressMedicalInstitutionInfoDto } from 'src/auth/dto/address-medical-institution-info.dto';
import { ContactInfoDto } from 'src/auth/dto/contact-info.dto';
import { EducationMedicalWorkerInfoDto } from 'src/auth/dto/education-medical-worker-info.dto';
import { IdentificationInfoDto } from 'src/auth/dto/identification-info.dto';
import { PersonalInfoDto } from 'src/auth/dto/personal-info.dto';
import { PlaceWorkInfoDto } from 'src/auth/dto/place-work-info.dto';

export class UserBaseResponseDto {
  @IsString() id: string;

  @ValidateNested()
  @Type(() => AddressInfoDto)
  addressRegistrationInfo: AddressInfoDto;

  @ValidateNested()
  @Type(() => AddressInfoDto)
  addressResidenceInfo: AddressInfoDto;

  @ValidateNested()
  @Type(() => ContactInfoDto)
  contactInfo: ContactInfoDto;

  @ValidateNested()
  @Type(() => IdentificationInfoDto)
  identificationInfo: IdentificationInfoDto;

  @ValidateNested()
  @Type(() => PersonalInfoDto)
  personalInfo: PersonalInfoDto;
}

export class DoctorBaseResponseDto extends UserBaseResponseDto {
  @ValidateNested()
  @Type(() => AddressMedicalInstitutionInfoDto)
  addressMedicalInstitutionInfo: AddressMedicalInstitutionInfoDto;

  @ValidateNested()
  @Type(() => EducationMedicalWorkerInfoDto)
  educationMedicalWorkerInfo: EducationMedicalWorkerInfoDto;

  @ValidateNested()
  @Type(() => PlaceWorkInfoDto)
  placeWorkInfo: PlaceWorkInfoDto;
}

// ответ клиенту PatientResponseDto
export class PatientResponseDto {
  @IsString() accessToken: string;

  @ValidateNested()
  @Type(() => UserBaseResponseDto)
  user: UserBaseResponseDto;
}

// ответ клиенту DoctorResponseDto
export class DoctorResponseDto {
  @IsString() accessToken: string;

  @ValidateNested()
  @Type(() => DoctorBaseResponseDto)
  user: DoctorBaseResponseDto;
}
