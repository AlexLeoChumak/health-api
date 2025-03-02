import { Module } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { CommonModule } from 'src/common/common.module';
import { RepositoriesModule } from 'src/repositories/repositories.module';

@Module({
  imports: [CommonModule, RepositoriesModule],
  controllers: [UserProfileController],
  providers: [UserProfileService],
})
export class UserProfileModule {}
