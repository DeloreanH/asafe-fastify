import { FastifyReply, FastifyRequest } from 'fastify';
import { UserService } from './user.service';

export interface CreateUserInput {
  name: string;
  email: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
}
export class UserController {
  constructor(private userService: UserService) {}

  async findAll(request: FastifyRequest, reply: FastifyReply) {
    const users = await this.userService.findAll();
    reply.send(users);
  }

  async findById(request: FastifyRequest<{ Params: { id: string}}>, reply: FastifyReply) {
    const user = await this.userService.findById(Number(request.params.id));
    reply.send(user);
  }

  async create(   
    request: FastifyRequest<{ Body: CreateUserInput }>,
    reply: FastifyReply) {
    const user = await this.userService.create(request.body);
    reply.status(201).send(user);
  }

  async update(
    request: FastifyRequest<{ Params: { id: number }; Body: UpdateUserInput }>,
    reply: FastifyReply
  ) {
    const user = await this.userService.update(Number(request.params.id), request.body);
    reply.send(user);
  }

  async delete(request: FastifyRequest<{ Params: { id: string}}>, reply: FastifyReply) {
    await this.userService.delete(Number(request.params.id));
    reply.status(204).send();
  }
}