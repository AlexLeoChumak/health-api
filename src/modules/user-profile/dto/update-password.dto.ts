import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserRoleType } from 'src/modules/user-profile/models/user-role.type';

export class UpdatePasswordDto {
  @IsString() @IsNotEmpty() userId: string;
  @IsString() @IsNotEmpty() userRole: UserRoleType;
  @IsString() @IsNotEmpty() oldPassword: string;
  @IsString() @IsNotEmpty() @MinLength(8) newPassword: string;
  @IsString() @IsNotEmpty() @MinLength(8) newPasswordConfirmation: string;
}
