import { IsString } from 'class-validator';

export class LoginRequestDto {
  @IsString()
  mobilePhoneNumber: string;

  @IsString()
  password: string;
}
