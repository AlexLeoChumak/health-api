import { Logger, Module } from '@nestjs/common';
import { BackblazeController } from './backblaze.controller';
import { BackblazeService } from './backblaze.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [BackblazeController],
  providers: [BackblazeService, Logger],
})
export class BackblazeModule {}
