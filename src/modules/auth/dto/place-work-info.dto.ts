import { IsString, IsNotEmpty } from 'class-validator';

export class PlaceWorkInfoDto {
  @IsString() @IsNotEmpty() currentSpecialization: string;
  @IsString() @IsNotEmpty() department: string;
  @IsString() @IsNotEmpty() nameMedicalInstitution: string;
}
