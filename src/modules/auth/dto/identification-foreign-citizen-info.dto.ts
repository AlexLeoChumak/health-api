import { IsString, IsOptional } from 'class-validator';

export class IdentificationForeignCitizenInfoDto {
  @IsString() @IsOptional() documentName: string | null;
  @IsString() @IsOptional() documentNumber: string | null;
  @IsString() @IsOptional() healthInsuranceContractNumber: string | null;
  @IsString() @IsOptional() nameInsuranceCompany: string | null;
  @IsString() @IsOptional() nameStateForeignCitizen: string | null;
}
