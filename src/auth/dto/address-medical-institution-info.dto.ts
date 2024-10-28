import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class AddressMedicalInstitutionInfoDto {
  @IsString() @IsOptional() apartment: string | null;
  @IsString() @IsNotEmpty() city: string;
  @IsString() @IsNotEmpty() district: string;
  @IsString() @IsNotEmpty() house: string;
  @IsString() @IsOptional() housing: string | null;
  @IsString() @IsNotEmpty() region: string;
  @IsString() @IsNotEmpty() street: string;
}
