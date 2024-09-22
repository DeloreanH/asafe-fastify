import { User } from '@prisma/client';
import { UserRepository } from './user.repository';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async create(data: Omit<User, 'id'>): Promise<User> {
    return this.userRepository.create(data);
  }

  async update(id: number, data: Partial<Omit<User, 'id'>>): Promise<User> {
    return this.userRepository.update(id, data);
  }

  async delete(id: number): Promise<User> {
    return this.userRepository.delete(id);
  }
}