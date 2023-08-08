import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<Repository<UserEntity>>;

  beforeEach(async () => {
    const userRepositoryMock = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user if it exists', async () => {
      const testUser: UserEntity = {
        id: 1,
        username: 'testUser',
        password: 'testPass',
      };
      userRepository.findOne.mockResolvedValue(testUser);

      expect(await userService.findOne('testUser')).toEqual(testUser);
    });

    it('should throw a NotFoundException if user does not exist', async () => {
      userRepository.findOne.mockResolvedValue(undefined);

      await expect(userService.findOne('testUser')).rejects.toThrow(
        new NotFoundException(`User with username testUser not found`),
      );
    });
  });

  describe('create', () => {
    it('should throw a BadRequestException if user already exists', async () => {
      const testUser: UserEntity = {
        id: 1,
        username: 'testUser',
        password: 'testPass',
      };
      userRepository.findOne.mockResolvedValue(testUser);

      await expect(userService.create(testUser)).rejects.toThrow(
        new BadRequestException('User already exists'),
      );
    });

    it('should create a user if it does not exist', async () => {
      const testUser: UserEntity = {
        id: 1,
        username: 'testUser',
        password: 'testPass',
      };
      userRepository.findOne.mockResolvedValue(undefined);
      userRepository.save.mockResolvedValue(testUser);

      expect(await userService.create(testUser)).toEqual(testUser);
    });
  });
});
