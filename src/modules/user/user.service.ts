import { User } from '@prisma/client';
import { UserRepository } from './user.repository';
import { CreateUserBody } from './schemas/user-create.schema';
import { ConflictException } from '../../shared/exceptions';
import { UpdateUserBody } from './schemas/user-update.schema';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export class UserService {
  constructor(private userRepository: UserRepository) { }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findByUid(uuid: string): Promise<User | null> {
    return this.userRepository.findByUid(uuid);
  }

  async create(data: CreateUserBody): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userData = {
      ...data,
      password: hashedPassword,
    };

    return this.userRepository.create(userData);
  }

  async update(uuid: string, data: UpdateUserBody): Promise<User> {
    return this.userRepository.update(uuid, data);
  }

  async delete(uuid: string): Promise<User> {
    return this.userRepository.delete(uuid);
  }
}