import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CommonModule } from 'src/common/common.module';
import { AuthController } from 'src/modules/auth/auth.controller';
import { AccessRefreshTokenService } from 'src/modules/auth/services/access-refresh-token/access-refresh-token.service';
import { LoginService } from 'src/modules/auth/services/login/login.service';
import { RegistrationService } from 'src/modules/auth/services/registration/registration.service';
import { SensitiveFieldsUserService } from 'src/modules/auth/services/sensitive-fields-user/sensitive-fields-user.service';
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
  ],
})
export class AuthModule {}
