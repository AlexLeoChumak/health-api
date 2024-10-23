import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  mobilePhoneNumber: string;

  @IsString()
  password: string;
}
