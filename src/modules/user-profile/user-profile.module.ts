import { Logger, Module } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { CommonModule } from 'src/common/common.module';
import { RepositoriesModule } from 'src/repositories/repositories.module';
import { CloudStorageModule } from 'src/shared/cloud-storage/cloud-storage.module';

@Module({
  imports: [CommonModule, RepositoriesModule, CloudStorageModule],
  controllers: [UserProfileController],
  providers: [UserProfileService, Logger],
})
export class UserProfileModule {}
