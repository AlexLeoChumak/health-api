import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString() @IsNotEmpty() userId: string;
  @IsString() @IsNotEmpty() userRole: 'doctor' | 'patient';
  @IsString() @IsNotEmpty() oldPassword: string;
  @IsString() @IsNotEmpty() @MinLength(8) newPassword: string;
  @IsString() @IsNotEmpty() @MinLength(8) newPasswordConfirmation: string;
}
