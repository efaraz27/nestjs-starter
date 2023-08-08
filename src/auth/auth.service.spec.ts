import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const userServiceMock = {
      findOne: jest.fn(),
      create: jest.fn(),
    };
    const jwtServiceMock = {
      sign: jest.fn(),
    };
    const configServiceMock = {
      get: jest.fn().mockReturnValue('TEST_SECRET'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('logIn', () => {
    it('should throw UnauthorizedException if user does not exist', async () => {
      userService.findOne.mockResolvedValue(null);

      await expect(authService.logIn('testUser', 'testPass')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      userService.findOne.mockResolvedValue({
        id: 1,
        username: 'testUser',
        password: 'correctPass',
      });

      await expect(authService.logIn('testUser', 'wrongPass')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return a JWT if credentials are correct', async () => {
      userService.findOne.mockResolvedValue({
        username: 'testUser',
        id: 1,
        password: 'testPass',
      });
      jwtService.sign.mockReturnValue('VALID_JWT');

      const result = await authService.logIn('testUser', 'testPass');

      expect(result.access_token).toBe('VALID_JWT');
    });
  });

  describe('register', () => {
    it('should create a new user and return a JWT', async () => {
      userService.create.mockResolvedValue({
        username: 'newUser',
        id: 2,
        password: 'newPass',
      });
      jwtService.sign.mockReturnValue('VALID_JWT');

      const result = await authService.register('newUser', 'newPass');

      expect(result.access_token).toBe('VALID_JWT');
    });
  });
});
