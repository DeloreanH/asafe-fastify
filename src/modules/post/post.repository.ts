import { Post, PrismaClient } from '@prisma/client';
import { CreatePostBody } from './schemas/post-create.schema';
import { UpdatePostBody } from './schemas/post-update.schema';

export class PostRepository {
  constructor(private prisma: PrismaClient) { }

  async findAll(): Promise<Post[]> {
    return this.prisma.post.findMany();
  }

  async findByUid(uuid: string): Promise<Post | null> {
    return this.prisma.post.findUnique({ where: { uuid } });
  }

  async create(data: CreatePostBody, authorUid: string): Promise<Post> {
    return this.prisma.post.create({ data: {
      ...data,
      authorUid,
    }});
  }

  async update(uuid: string, data: UpdatePostBody): Promise<Post> {
    return this.prisma.post.update({ where: { uuid }, data });
  }

  async delete(uuid: string): Promise<Post> {
    return this.prisma.post.delete({ where: { uuid } });
  }
}
