import { Logger, Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { AuthController } from 'src/modules/auth/auth.controller';
import { AccessRefreshTokenService } from 'src/modules/auth/services/access-refresh-token/access-refresh-token.service';
import { LoginService } from 'src/modules/auth/services/login/login.service';
import { RegistrationService } from 'src/modules/auth/services/registration/registration.service';
import { RepositoriesModule } from 'src/repositories/repositories.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [CommonModule, SharedModule, RepositoriesModule],
  controllers: [AuthController],
  providers: [
    RegistrationService,
    LoginService,
    AccessRefreshTokenService,
    Logger,
  ],
  exports: [],
})
export class AuthModule {}
