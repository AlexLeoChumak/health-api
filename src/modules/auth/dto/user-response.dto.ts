import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { AddressInfoDto } from 'src/modules/auth/dto/address-info.dto';
import { AddressMedicalInstitutionInfoDto } from 'src/modules/auth/dto/address-medical-institution-info.dto';
import { ContactInfoDto } from 'src/modules/auth/dto/contact-info.dto';
import { EducationMedicalWorkerInfoDto } from 'src/modules/auth/dto/education-medical-worker-info.dto';
import { IdentificationBelarusCitizenInfoDto } from 'src/modules/auth/dto/identification-belarus-citizen-info.dto';
import { IdentificationForeignCitizenInfoDto } from 'src/modules/auth/dto/identification-foreign-citizen-info.dto';
import { MobilePhoneNumberPasswordInfoDto } from 'src/modules/auth/dto/mobile-phone-number-password-info.dto';
import { PersonalInfoDto } from 'src/modules/auth/dto/personal-info.dto';
import { PlaceWorkInfoDto } from 'src/modules/auth/dto/place-work-info.dto';

export class PatientBaseResponseDto {
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
  @Type(() => MobilePhoneNumberPasswordInfoDto)
  mobilePhoneNumberPasswordInfo: MobilePhoneNumberPasswordInfoDto;

  @ValidateNested()
  @Type(() => IdentificationBelarusCitizenInfoDto)
  identificationBelarusCitizenInfo: IdentificationBelarusCitizenInfoDto;

  @ValidateNested()
  @Type(() => IdentificationForeignCitizenInfoDto)
  identificationForeignCitizenInfo: IdentificationForeignCitizenInfoDto;

  @ValidateNested()
  @Type(() => PersonalInfoDto)
  personalInfo: PersonalInfoDto;
}

export class DoctorBaseResponseDto extends PatientBaseResponseDto {
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
  @Type(() => PatientBaseResponseDto)
  user: PatientBaseResponseDto;
}

// ответ клиенту DoctorResponseDto
export class DoctorResponseDto {
  @IsString() accessToken: string;

  @ValidateNested()
  @Type(() => DoctorBaseResponseDto)
  user: DoctorBaseResponseDto;
}
