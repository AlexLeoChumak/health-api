import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class PersonalInfoDto {
  @IsString() @IsNotEmpty() dateOfBirth: string;
  @IsString() @IsNotEmpty() firstName: string;
  @IsString() @IsNotEmpty() gender: string;
  @IsString() @IsNotEmpty() lastName: string;
  @IsString() @IsOptional() middleName: string | null;
  @IsOptional() photo: string | null;
}
