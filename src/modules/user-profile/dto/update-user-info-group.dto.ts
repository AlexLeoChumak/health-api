import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsObject } from 'class-validator';
import { AddressInfoDto } from 'src/modules/auth/dto/address-info.dto';
import { AddressMedicalInstitutionInfoDto } from 'src/modules/auth/dto/address-medical-institution-info.dto';
import { ContactInfoDto } from 'src/modules/auth/dto/contact-info.dto';
import { EducationMedicalWorkerInfoDto } from 'src/modules/auth/dto/education-medical-worker-info.dto';
import { IdentificationBelarusCitizenInfoDto } from 'src/modules/auth/dto/identification-belarus-citizen-info.dto';
import { IdentificationForeignCitizenInfoDto } from 'src/modules/auth/dto/identification-foreign-citizen-info.dto';
import { MobilePhoneNumberPasswordInfoDto } from 'src/modules/auth/dto/mobile-phone-number-password-info.dto';
import { PersonalInfoDto } from 'src/modules/auth/dto/personal-info.dto';
import { PlaceWorkInfoDto } from 'src/modules/auth/dto/place-work-info.dto';
import { UserRoleType } from 'src/modules/user-profile/models/user-role.type';

export type UpdateUserInfoType =
  | { personalInfo: PersonalInfoDto }
  | { contactInfo: ContactInfoDto }
  | { mobilePhoneNumberPasswordInfo: MobilePhoneNumberPasswordInfoDto }
  | { identificationBelarusCitizenInfo: IdentificationBelarusCitizenInfoDto }
  | { identificationForeignCitizenInfo: IdentificationForeignCitizenInfoDto }
  | { addressRegistrationInfo: AddressInfoDto }
  | { addressResidenceInfo: AddressInfoDto }
  | { addressMedicalInstitutionInfo: AddressMedicalInstitutionInfoDto }
  | { educationMedicalWorkerInfo: EducationMedicalWorkerInfoDto }
  | { placeWorkInfo: PlaceWorkInfoDto };

export class UpdateUserInfoGroupDto {
  @IsString() @IsNotEmpty() userId: string;
  @IsString() @IsNotEmpty() userRole: UserRoleType;
  @IsString() @IsNotEmpty() keyNameInfoGroup: string;

  @IsObject()
  @Type(() => Object)
  updateInfoGroup: UpdateUserInfoType;
}
