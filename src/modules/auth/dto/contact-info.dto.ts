import { IsEmail, IsString, IsOptional } from 'class-validator';

export class ContactInfoDto {
  @IsEmail() email: string;
  @IsString() @IsOptional() homePhoneNumber: string | null;
}
