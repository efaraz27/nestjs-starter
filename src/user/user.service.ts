import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findOne(username: string): Promise<UserEntity | undefined> {
    const options = {
      where: { username },
    };
    const user = await this.userRepository.findOne(options);

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return user;
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOne({
      where: { username: user.username },
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    return this.userRepository.save(user);
  }
}
