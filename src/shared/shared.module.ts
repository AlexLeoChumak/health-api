import { Module } from '@nestjs/common';
import { CloudStorageModule } from 'src/shared/modules/cloud-storage/cloud-storage.module';
import { JwtConfigModule } from 'src/shared/modules/jwt-config/jwt-config.module';
import { SensitiveFieldsUserService } from 'src/shared/services/sensitive-fields-user/sensitive-fields-user.service';

@Module({
  imports: [CloudStorageModule, JwtConfigModule],
  providers: [SensitiveFieldsUserService],
  exports: [CloudStorageModule, JwtConfigModule, SensitiveFieldsUserService],
})
export class SharedModule {}
