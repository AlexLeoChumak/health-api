import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { CommonModule } from 'src/common/common.module';
import { EntitiesModule } from 'src/entities/entities.module';

@Module({
  imports: [
    EntitiesModule,
    CommonModule,
    JwtModule.register({
      secret: 'interstellar',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, Logger],
})
export class AuthModule {}
