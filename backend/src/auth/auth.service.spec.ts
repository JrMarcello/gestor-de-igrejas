import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException } from '@nestjs/common';
import { Role } from '@prisma/client';

jest.mock('bcrypt', () => ({
  hash: jest.fn(() => Promise.resolve('hashedPassword')),
  compare: jest.fn(() => Promise.resolve(true)),
  genSalt: jest.fn(() => Promise.resolve('mockSalt')),
}));

import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let jwt: JwtService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn(() => Promise.resolve('mockedAccessToken')),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwt = module.get<JwtService>(JwtService);

    // Reset mocks before each test
    (bcrypt.hash as jest.Mock).mockClear();
    (bcrypt.compare as jest.Mock).mockClear();
    mockPrismaService.user.create.mockClear();
    mockPrismaService.user.findUnique.mockClear();
    mockJwtService.signAsync.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should create a user', async () => {
      mockPrismaService.user.create.mockResolvedValueOnce({
        id: 'someId',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: Role.MEMBER,
      });

      const result = await service.signup({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(bcrypt.hash).toHaveBeenCalledWith(
        'password123',
        expect.any(String),
      );
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          password: 'hashedPassword',
        },
      });
      expect(result).toEqual({
        id: 'someId',
        email: 'test@example.com',
        role: Role.MEMBER,
      });
    });

    it('should throw ForbiddenException if email is taken', async () => {
      mockPrismaService.user.create.mockRejectedValueOnce({
        code: 'P2002',
      });

      await expect(
        service.signup({
          email: 'test@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('signin', () => {
    const mockUser = {
      id: 'someId',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: Role.MEMBER,
    };

    it('should return an access token on successful signin', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(mockUser);
      (bcrypt.compare as jest.Mock).mockImplementation(() =>
        Promise.resolve(true),
      );

      const result = await service.signin({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password123',
        'hashedPassword',
      );
      expect(jwt.signAsync).toHaveBeenCalledWith({
        sub: 'someId',
        email: 'test@example.com',
        role: Role.MEMBER,
      });
      expect(result).toEqual({ access_token: 'mockedAccessToken' });
    });

    it('should throw ForbiddenException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.signin({
          email: 'test@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if password incorrect', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(mockUser);
      (bcrypt.compare as jest.Mock).mockImplementation(() =>
        Promise.resolve(false),
      );

      await expect(
        service.signin({
          email: 'test@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('signToken', () => {
    it('should return an access token', async () => {
      const result = await service.signToken(
        'someId',
        'test@example.com',
        Role.ADMIN,
      );

      expect(jwt.signAsync).toHaveBeenCalledWith({
        sub: 'someId',
        email: 'test@example.com',
        role: Role.ADMIN,
      });
      expect(result).toEqual({ access_token: 'mockedAccessToken' });
    });
  });
});
