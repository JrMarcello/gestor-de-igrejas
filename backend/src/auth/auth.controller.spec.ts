import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from './dto/auth.dto';
import { ForbiddenException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    signup: jest.fn(),
    signin: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should call authService.signup and return the user', async () => {
      const signUpDto: SignUpDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const expectedResult = { id: 'someId', email: 'test@example.com' };
      mockAuthService.signup.mockResolvedValueOnce(expectedResult);

      const result = await controller.signup(signUpDto);

      expect(service.signup).toHaveBeenCalledWith(signUpDto);
      expect(result).toEqual(expectedResult);
    });

    it('should rethrow ForbiddenException from service', async () => {
      const signUpDto: SignUpDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      mockAuthService.signup.mockRejectedValueOnce(new ForbiddenException());

      await expect(controller.signup(signUpDto)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('signin', () => {
    it('should call authService.signin and return the token', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const expectedResult = { access_token: 'mockedAccessToken' };
      mockAuthService.signin.mockResolvedValueOnce(expectedResult);

      const result = await controller.signin(signInDto);

      expect(service.signin).toHaveBeenCalledWith(signInDto);
      expect(result).toEqual(expectedResult);
    });

    it('should rethrow ForbiddenException from service', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      mockAuthService.signin.mockRejectedValueOnce(new ForbiddenException());

      await expect(controller.signin(signInDto)).rejects.toThrow(ForbiddenException);
    });
  });
});
