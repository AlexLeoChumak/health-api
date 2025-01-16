import { Test, TestingModule } from '@nestjs/testing';
import { AccessRefreshTokenService } from './access-refresh-token.service';

describe('AccessRefreshTokenService', () => {
  let service: AccessRefreshTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccessRefreshTokenService],
    }).compile();

    service = module.get<AccessRefreshTokenService>(AccessRefreshTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
