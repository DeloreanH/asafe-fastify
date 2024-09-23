import { Post } from '@prisma/client';
import { PostRepository } from './post.repository';
import { CreatePostBody } from './schemas/post-create.schema';
import { UpdatePostBody } from './schemas/post-update.schema';

export class PostService {
  constructor(private postRepository: PostRepository) { }

  async findAll(): Promise<Post[]> {
    return this.postRepository.findAll();
  }

  async findByUid(uuid: string): Promise<Post | null> {
    return this.postRepository.findByUid(uuid);
  }

  async create(data: CreatePostBody, authorUid: string): Promise<Post> {
    return this.postRepository.create(data, authorUid);
  }

  async update(uuid: string, data: UpdatePostBody): Promise<Post> {
    return this.postRepository.update(uuid, data);
  }

  async delete(uuid: string): Promise<Post> {
    return this.postRepository.delete(uuid);
  }
}
