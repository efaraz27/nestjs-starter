import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const authServiceMock = {
      logIn: jest.fn(),
      register: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
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
