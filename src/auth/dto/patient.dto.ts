import {
  IsEmail,
  IsOptional,
  IsString,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

class AddressInfoDto {
  @IsString() @IsOptional() apartment: string | null;
  @IsString() @IsNotEmpty() city: string;
  @IsString() @IsNotEmpty() district: string;
  @IsString() @IsNotEmpty() house: string;
  @IsString() @IsOptional() housing: string | null;
  @IsString() @IsNotEmpty() region: string;
  @IsString() @IsNotEmpty() street: string;
}

export class ContactInfoDto {
  @IsEmail() email: string;
  @IsString() @IsOptional() homePhoneNumber: string | null;
  @IsString() @IsNotEmpty() mobilePhoneNumber: string;
}

class IdentificationInfoDto {
  @IsString() @IsOptional() documentName: string | null;
  @IsString() @IsOptional() documentNumber: string | null;
  @IsString() @IsOptional() healthInsuranceContractNumber: string | null;
  @IsString() @IsOptional() nameInsuranceCompany: string | null;
  @IsString() @IsOptional() nameStateForeignCitizen: string | null;
  @IsString() @IsOptional() passportIssueDate: string | null;
  @IsString() @IsOptional() passportIssuingAuthority: string | null;
  @IsString() @IsOptional() passportSeriesNumber: string | null;
  @IsString() @IsOptional() personalIdentificationNumber: string | null;
  @IsString() @IsNotEmpty() userCitizenship: string;
}

class PersonalInfoDto {
  @IsString() @IsNotEmpty() dateOfBirth: string;
  @IsString() @IsNotEmpty() firstName: string;
  @IsString() @IsNotEmpty() gender: string;
  @IsString() @IsNotEmpty() lastName: string;
  @IsString() @IsOptional() middleName: string | null;
  @IsNotEmpty() photo: File | string;
}

export class PatientBaseDto {
  addressRegistrationInfo: AddressInfoDto;
  addressResidenceInfo: AddressInfoDto;
  identificationInfo: IdentificationInfoDto;
  personalInfo: PersonalInfoDto;
}

export class ContactInfoWithPasswordDto extends ContactInfoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class ContactInfoWithHashedPasswordDto extends ContactInfoDto {
  @IsString()
  @IsNotEmpty()
  hashedPassword: string;
}

// REQUEST
// DTO запроса пациента с паролем без вложения в объект user
export class PatienWithPasswordtDto extends PatientBaseDto {
  @IsNotEmpty()
  contactInfo: ContactInfoWithPasswordDto;
}

// DTO запроса пациента с паролем с вложением в объект user
export class PatientRequestDto {
  @IsNotEmpty()
  user: PatienWithPasswordtDto;
}

// RESPONSE
// DTO запроса пациента с хешированным паролем без вложения в объект user
export class PatientWithHashedPasswordDto extends PatientBaseDto {
  @IsNotEmpty()
  contactInfo: ContactInfoWithHashedPasswordDto;
}

// DTO ответа пациента с хэшированным паролем с вложением в объект user
export class PatientResponseDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  user: PatientWithHashedPasswordDto;
}
