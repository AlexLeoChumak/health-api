import { Logger, Module } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { CommonModule } from 'src/common/common.module';
import { RepositoriesModule } from 'src/repositories/repositories.module';
import { CloudStorageModule } from 'src/shared/modules/cloud-storage/cloud-storage.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [CommonModule, SharedModule, RepositoriesModule, CloudStorageModule],
  controllers: [UserProfileController],
  providers: [UserProfileService, Logger],
})
export class UserProfileModule {}
