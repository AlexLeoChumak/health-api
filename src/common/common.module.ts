import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtConfigModule } from 'src/shared/modules/jwt-config/jwt-config.module';

@Module({
  imports: [HttpModule, JwtConfigModule],
  providers: [],
  exports: [JwtConfigModule],
})
export class CommonModule {}
