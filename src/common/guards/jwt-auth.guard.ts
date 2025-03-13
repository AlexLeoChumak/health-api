/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SHARED_CONSTANT } from 'src/common/constants/shared.constant';
import { CustomRequestInterface } from 'src/common/models/custom-request.interface';
import { DecodedAccessRefreshTokenInterface } from 'src/common/models/decoded-access-refresh-token.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: CustomRequestInterface = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException(
        SHARED_CONSTANT.AUTHORIZATION_HEADER_MISSING,
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload: DecodedAccessRefreshTokenInterface =
        await this.jwtService.verifyAsync(token);
      request.userDecodedToken = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException(SHARED_CONSTANT.TOKEN_INVALID_OR_EXPIRED);
    }
  }
}
