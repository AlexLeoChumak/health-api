import { IsNotEmpty, IsString } from 'class-validator';

export class MobilePhoneNumberPasswordInfoDto {
  @IsString() @IsNotEmpty() mobilePhoneNumber: string;
}
