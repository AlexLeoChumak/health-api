import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class IdentificationInfoDto {
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
