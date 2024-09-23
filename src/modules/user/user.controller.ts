import { FastifyReply, FastifyRequest } from 'fastify';
import { UserService } from './user.service';
import { CreateUserBody } from './schemas/user-create.schema';
import { UpdateUserBody } from './schemas/user-update.schema';
import { WebSocketService } from '../websocket/websocket.service';

export class UserController {
  constructor(
    private userService: UserService,
    private webSocketService: WebSocketService) { }

  async findAll(request: FastifyRequest, reply: FastifyReply) {
    const users = await this.userService.findAll();
    reply.status(200).send(users);
  }

  async findByUid(request: FastifyRequest<{ Params: { uuid: string } }>, reply: FastifyReply) {
    const user = await this.userService.findByUid(request.params.uuid);
    reply.status(200).send(user);
  }

  async create(
    request: FastifyRequest<{ Body: CreateUserBody }>,
    reply: FastifyReply) {
    const user = await this.userService.create(request.body);
    reply.status(201).send(user);
  }

  async update(
    request: FastifyRequest<{ Params: { uuid: string }; Body: UpdateUserBody }>,
    reply: FastifyReply
  ) {
    const user = await this.userService.update(request.params.uuid, request.body);
    this.webSocketService.emitUserUpdate(user);
    reply.status(200).send(user);
  }

  async delete(request: FastifyRequest<{ Params: { uuid: string } }>, reply: FastifyReply) {
    await this.userService.delete(request.params.uuid);
    reply.status(204).send();
  }

  async updateAvatar(request: FastifyRequest, reply: FastifyReply) {
    const avatarFile = await request.file();
    const user = await this.userService.updateAvatar((request.user as {uuid: string}).uuid, avatarFile);
    reply.status(200).send(user);
  }
}