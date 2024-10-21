import { Module } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { CommonModule } from 'src/common/common.module';
import { EntitiesModule } from 'src/entities/entities.module';

@Module({
  imports: [EntitiesModule, CommonModule],
  controllers: [UserProfileController],
  providers: [UserProfileService],
})
export class UserProfileModule {}
