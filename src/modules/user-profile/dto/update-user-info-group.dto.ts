import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsObject } from 'class-validator';
import { UpdateUserInfoGroupType } from 'src/modules/user-profile/models/update-user-info-group.type';
import { UserRoleType } from 'src/common/models/user-role.type';

export class UpdateUserInfoGroupDto {
  @IsString() @IsNotEmpty() userId: string;
  @IsString() @IsNotEmpty() userRole: UserRoleType;

  @IsObject()
  @Type(() => Object)
  updateInfoGroup: UpdateUserInfoGroupType;
}
