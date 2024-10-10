import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CloudStorageService } from 'src/common/modules/services/cloud-storage/cloud-storage.service';

@Module({
  imports: [HttpModule],
  providers: [CloudStorageService],
  exports: [CloudStorageService],
})
export class CommonModule {}
