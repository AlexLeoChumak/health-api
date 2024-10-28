import { IsEmail, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class ContactInfoDto {
  @IsEmail() email: string;
  @IsString() @IsOptional() homePhoneNumber: string | null;
  @IsString() @IsNotEmpty() mobilePhoneNumber: string;
}
