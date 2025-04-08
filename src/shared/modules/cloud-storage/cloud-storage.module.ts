import { Logger, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CloudStorageController } from 'src/shared/modules/cloud-storage/cloud-storage.controller';
import { CloudStorageService } from 'src/shared/modules/cloud-storage/cloud-storage.service';

@Module({
  imports: [HttpModule],
  controllers: [CloudStorageController],
  providers: [CloudStorageService, Logger],
  exports: [CloudStorageService],
})
export class CloudStorageModule {}
