import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { CloudStorageService } from 'src/common/services/cloud-storage/cloud-storage.service';

@Module({
  imports: [HttpModule],
  providers: [CloudStorageService],
  exports: [CloudStorageService],
})
export class CommonModule {}
