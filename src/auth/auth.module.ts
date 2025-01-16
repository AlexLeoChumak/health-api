import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from 'src/auth/auth.controller';
import { LoginService } from 'src/auth/services/login.service';
import { RegistrationService } from 'src/auth/services/registration.service';
import { CommonModule } from 'src/common/common.module';
import { EntitiesModule } from 'src/entities/entities.module';
import { AccessRefreshTokenService } from './services/access-refresh-token.service';
import { SensitiveFieldsUserService } from 'src/auth/services/sensitive-fields-user.service';

@Module({
  imports: [
    CommonModule,
    EntitiesModule,
    JwtModule.register({
      secret: 'interstellar',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegistrationService,
    LoginService,
    AccessRefreshTokenService,
    SensitiveFieldsUserService,
    Logger,
  ],
})
export class AuthModule {}
