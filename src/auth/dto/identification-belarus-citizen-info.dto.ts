import { IsString, IsOptional } from 'class-validator';

export class IdentificationBelarusCitizenInfoDto {
  @IsString() @IsOptional() passportIssueDate: string | null;
  @IsString() @IsOptional() passportIssuingAuthority: string | null;
  @IsString() @IsOptional() passportSeriesNumber: string | null;
  @IsString() @IsOptional() personalIdentificationNumber: string | null;
}
