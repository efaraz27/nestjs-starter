import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { ConfigService } from '@nestjs/config';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const authServiceMock = {
      logIn: jest.fn(),
      register: jest.fn(),
    };
    const jwtServiceMock = {
      sign: jest.fn(),
    };
    const authGuardMock = {
      canActivate: jest.fn(() => true),
    };
    const configServiceMock = {
      get: jest.fn().mockReturnValue('TEST_SECRET'),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: AuthGuard, useValue: authGuardMock },
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.logIn with correct parameters', async () => {
      const dto = { username: 'testUser', password: 'testPass' };
      await authController.login(dto);
      expect(authService.logIn).toHaveBeenCalledWith(
        dto.username,
        dto.password,
      );
    });
  });

  describe('register', () => {
    it('should call authService.register with correct parameters', async () => {
      const dto = { username: 'testUser', password: 'testPass' };
      await authController.register(dto);
      expect(authService.register).toHaveBeenCalledWith(
        dto.username,
        dto.password,
      );
    });
  });
});
