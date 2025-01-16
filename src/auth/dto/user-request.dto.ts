import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { AddressInfoDto } from 'src/auth/dto/address-info.dto';
import { AddressMedicalInstitutionInfoDto } from 'src/auth/dto/address-medical-institution-info.dto';
import { ContactInfoDto } from 'src/auth/dto/contact-info.dto';
import { EducationMedicalWorkerInfoDto } from 'src/auth/dto/education-medical-worker-info.dto';
import { IdentificationInfoDto } from 'src/auth/dto/identification-info.dto';
import { MobilePhoneNumberPasswordInfoDto } from 'src/auth/dto/mobile-phone-number-password-info.dto';
import { PersonalInfoDto } from 'src/auth/dto/personal-info.dto';
import { PlaceWorkInfoDto } from 'src/auth/dto/place-work-info.dto';

// Базовый DTO пользователя
export class UserBaseRequestDto {
  @ValidateNested()
  @Type(() => AddressInfoDto)
  addressRegistrationInfo: AddressInfoDto;

  @ValidateNested()
  @Type(() => AddressInfoDto)
  addressResidenceInfo: AddressInfoDto;

  @ValidateNested()
  @Type(() => IdentificationInfoDto)
  identificationInfo: IdentificationInfoDto;

  @ValidateNested()
  @Type(() => PersonalInfoDto)
  personalInfo: PersonalInfoDto;

  @ValidateNested()
  @Type(() => ContactInfoDto)
  contactInfo: ContactInfoDto;
}

// ContactInfo с паролем
export class MobilePhoneNumberPasswordInfoIncludesPasswordFieldDto extends MobilePhoneNumberPasswordInfoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

// ContactInfo с хешированным паролем
export class MobilePhoneNumberPasswordInfoIncludesHashedPasswordFieldDto extends MobilePhoneNumberPasswordInfoDto {
  @IsString()
  @IsNotEmpty()
  hashedPassword: string;
}

// Пациент с паролем (без вложения в объект user)
export class PatientRequestIncludesPasswordDto extends UserBaseRequestDto {
  @ValidateNested()
  @Type(() => MobilePhoneNumberPasswordInfoIncludesPasswordFieldDto)
  mobilePhoneNumberPasswordInfo: MobilePhoneNumberPasswordInfoIncludesPasswordFieldDto;
}

// Пациент с хешированным паролем (без вложения в объект user)
export class PatientRequestIncludesHashedPasswordDto extends UserBaseRequestDto {
  @ValidateNested()
  @Type(() => MobilePhoneNumberPasswordInfoIncludesHashedPasswordFieldDto)
  mobilePhoneNumberPasswordInfo: MobilePhoneNumberPasswordInfoIncludesHashedPasswordFieldDto;
}

// Пациентский запрос с клиента (с вложением в объект user)
export class PatientRequestDto {
  @ValidateNested()
  @Type(() => PatientRequestIncludesPasswordDto)
  user: PatientRequestIncludesPasswordDto;
}

// Доктор с базовыми данными
export class DoctorBaseRequestDto extends UserBaseRequestDto {
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

// Доктор с паролем (без вложения в объект user)
export class DoctorRequestIncludesPasswordDto extends DoctorBaseRequestDto {
  @ValidateNested()
  @Type(() => MobilePhoneNumberPasswordInfoIncludesPasswordFieldDto)
  mobilePhoneNumberPasswordInfo: MobilePhoneNumberPasswordInfoIncludesPasswordFieldDto;
}

// Доктор с хешированным паролем (без вложения в объект user)
export class DoctorRequestIncludesHashedPasswordDto extends DoctorBaseRequestDto {
  @ValidateNested()
  @Type(() => MobilePhoneNumberPasswordInfoIncludesHashedPasswordFieldDto)
  mobilePhoneNumberPasswordInfo: MobilePhoneNumberPasswordInfoIncludesHashedPasswordFieldDto;
}

// Докторский запрос с клиента (с вложением в объект user)
export class DoctorRequestDto {
  @ValidateNested()
  @Type(() => DoctorRequestIncludesPasswordDto)
  user: DoctorRequestIncludesPasswordDto;
}
