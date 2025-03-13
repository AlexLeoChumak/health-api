import { Request } from 'express';
import { DecodedAccessRefreshTokenInterface } from 'src/common/models/decoded-access-refresh-token.interface';

export interface CustomRequestInterface extends Request {
  userDecodedToken: DecodedAccessRefreshTokenInterface;
}
