import { PrismaClient, User } from '@prisma/client';
import { CreateUserBody } from './schemas/user-create.schema';
import { UpdateUserBody } from './schemas/user-update.schema';

export class UserRepository {
  constructor(private prisma: PrismaClient) { }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findByUid(uuid: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { uuid } });
  }

  async create(data: CreateUserBody): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async update(uuid: string, data: UpdateUserBody): Promise<User> {
    return this.prisma.user.update({ where: { uuid }, data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async delete(uuid: string): Promise<User> {
    return this.prisma.user.delete({ where: { uuid } });
  }
}