import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { UserController } from './user.controller';
import { CreateUserBody, createUserBodySchema, CreateUserResponseSchema } from './schemas/user-create.schema';


export async function UserRoutes(fastify: FastifyInstance) {
  const userController = fastify.diContainer.resolve<UserController>('userController');

  fastify.post<{ Body: CreateUserBody }>('/create', {
    schema: {
      body: createUserBodySchema,
      response:{
        201: CreateUserResponseSchema
      },
    },
  }, async (req: FastifyRequest<{ Body: CreateUserBody }>, reply: FastifyReply) => {
    return userController.create(req, reply);
  });
}