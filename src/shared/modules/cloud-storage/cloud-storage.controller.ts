import { Controller } from '@nestjs/common';
import { CloudStorageService } from 'src/shared/modules/cloud-storage/cloud-storage.service';

@Controller('cloud-storage')
export class CloudStorageController {
  constructor(private readonly cloudStorageService: CloudStorageService) {}
}
