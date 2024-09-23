import { Post, PrismaClient } from '@prisma/client';
import { CreatePostBody } from './schemas/post-create.schema';
import { UpdatePostBody } from './schemas/post-update.schema';

export class PostRepository {
  constructor(private prisma: PrismaClient) { }

  async findAll(): Promise<Post[]> {
    return this.prisma.post.findMany();
  }

  async findByUUID(uuid: string): Promise<Post | null> {
    return this.prisma.post.findUnique({ where: { uuid } });
  }

  async create(data: CreatePostBody, authorId: number): Promise<Post> {
    return this.prisma.post.create({ data: {
      ...data,
      authorId,
    }});
  }

  async update(uuid: string, data: UpdatePostBody): Promise<Post> {
    return this.prisma.post.update({ where: { uuid }, data });
  }

  async delete(uuid: string): Promise<Post> {
    return this.prisma.post.delete({ where: { uuid } });
  }
}
