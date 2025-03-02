import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from 'src/auth/auth.controller';
import { LoginService } from 'src/auth/services/login.service';
import { RegistrationService } from 'src/auth/services/registration.service';
import { CommonModule } from 'src/common/common.module';
import { AccessRefreshTokenService } from './services/access-refresh-token.service';
import { SensitiveFieldsUserService } from 'src/auth/services/sensitive-fields-user.service';
import { PasswordService } from './services/password/password.service';
import { RepositoriesModule } from 'src/repositories/repositories.module';

@Module({
  imports: [
    CommonModule,
    RepositoriesModule,
    JwtModule.register({
      secret: 'interstellar',
      signOptions: { expiresIn: '1h' },
    }),
    RepositoriesModule,
  ],
  controllers: [AuthController],
  providers: [
    RegistrationService,
    LoginService,
    AccessRefreshTokenService,
    SensitiveFieldsUserService,
    PasswordService,
    Logger,
  ],
})
export class AuthModule {}
