import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { CreateUserInput, UserController } from './user.controller';

export async function UserRoutes(fastify: FastifyInstance) {
  const userController = fastify.diContainer.resolve<UserController>('userController');

  fastify.post<{ Body: CreateUserInput }>('/create', (req: FastifyRequest<{ Body: CreateUserInput }>, reply: FastifyReply) => {
    return userController.create(req, reply);
  });
}