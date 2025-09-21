import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { Role } from '@prisma/client';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    // Mock process.env.JWT_SECRET directly for simplicity in this test
    process.env.JWT_SECRET = 'testSecret';

    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  afterEach(() => {
    delete process.env.JWT_SECRET; // Clean up after test
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return the user payload', () => {
      const payload = {
        sub: 'someUserId',
        email: 'test@example.com',
        role: Role.MEMBER,
      };
      const result = jwtStrategy.validate(payload);
      expect(result).toEqual({
        userId: 'someUserId',
        email: 'test@example.com',
        role: Role.MEMBER,
      });
    });
  });
});
