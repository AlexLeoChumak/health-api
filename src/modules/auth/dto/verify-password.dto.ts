import { IsNotEmpty, IsString } from 'class-validator';
import { UserRoleType } from 'src/common/models/user-role.type';

export class VerifyPasswordDto {
  @IsString() @IsNotEmpty() password: string;
  @IsString() @IsNotEmpty() userId: string;
  @IsNotEmpty() userType: UserRoleType;
}
