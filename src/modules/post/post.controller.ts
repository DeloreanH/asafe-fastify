import { FastifyReply, FastifyRequest } from 'fastify';
import { PostService } from './post.service';
import { CreatePostBody } from './schemas/post-create.schema';
import { UpdatePostBody } from './schemas/post-update.schema';

export class PostController {
  constructor(private postService: PostService) { }

  async findAll(request: FastifyRequest, reply: FastifyReply) {
    const users = await this.postService.findAll();
    reply.send(users);
  }

  async findByUid(request: FastifyRequest<{ Params: { uuid: string } }>, reply: FastifyReply) {
    const user = await this.postService.findByUid(request.params.uuid);
    reply.send(user);
  }

  async create(
    request: FastifyRequest<{ Body: CreatePostBody; }>,
    reply: FastifyReply) {
    const authorUid = (request.user as {uuid: string} ).uuid;
    const post = await this.postService.create(request.body, authorUid);
    reply.status(201).send(post);
  }

  async update(
    request: FastifyRequest<{ Params: { uuid: string }; Body: UpdatePostBody }>,
    reply: FastifyReply
  ) {
    const user = await this.postService.update(request.params.uuid, request.body);
    reply.send(user);
  }

  async delete(request: FastifyRequest<{ Params: { uuid: string } }>, reply: FastifyReply) {
    await this.postService.delete(request.params.uuid);
    reply.status(204).send();
  }
}
