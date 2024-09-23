import { PrismaClient, User } from '@prisma/client';
import { CreateUserBody } from './schemas/user-create.schema';

interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  create(data: Omit<User, 'id'>): Promise<User>;
  update(id: number, data: Partial<Omit<User, 'id'>>): Promise<User>;
  delete(id: number): Promise<User>;
}

export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(data: CreateUserBody): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async update(id: number, data: Partial<Omit<User, 'id'>>): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async delete(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}