import { User } from '@prisma/client';
import { UserRepository } from './user.repository';
import { CreateUserBody } from './schemas/user-create.schema';
import { ConflictException } from '../../shared/exceptions';
import bcrypt from 'bcrypt';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
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

  async update(id: number, data: Partial<Omit<User, 'id'>>): Promise<User> {
    return this.userRepository.update(id, data);
  }

  async delete(id: number): Promise<User> {
    return this.userRepository.delete(id);
  }
}