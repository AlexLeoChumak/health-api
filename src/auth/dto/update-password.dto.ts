import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class UpdatePasswordDto {
  @IsString() @IsNotEmpty() userId: string;

  @ValidateNested()
  @Type(() => PasswordsDto)
  passwords: PasswordsDto;
}

export class PasswordsDto {
  @IsString() @IsNotEmpty() oldPassword: string;
  @IsString() @IsNotEmpty() @MinLength(8) newPassword: string;
  @IsString() @IsNotEmpty() @MinLength(8) newPasswordConfirmation: string;
}
