import { FastifyReply, FastifyRequest } from 'fastify';
import { UserService } from './user.service';
import { CreateUserBody } from './schemas/user-create.schema';
import { updateUserBody } from './schemas/user-update.schema';

export class UserController {
  constructor(private userService: UserService) { }

  async findAll(request: FastifyRequest, reply: FastifyReply) {
    const users = await this.userService.findAll();
    reply.send(users);
  }

  async findById(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    const user = await this.userService.findById(request.params.id);
    reply.send(user);
  }

  async create(
    request: FastifyRequest<{ Body: CreateUserBody }>,
    reply: FastifyReply) {
    const user = await this.userService.create(request.body);
    reply.status(201).send(user);
  }

  async update(
    request: FastifyRequest<{ Params: { id: number }; Body: updateUserBody }>,
    reply: FastifyReply
  ) {
    const user = await this.userService.update(request.params.id, request.body);
    reply.send(user);
  }

  async delete(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    await this.userService.delete(request.params.id);
    reply.status(204).send();
  }
}