import { FastifyInstance, FastifyReply, FastifyRequest, FastifySchema } from 'fastify';
import { UserController } from './user.controller';
import { CreateUserBody, createUserBodySchema, CreateUserResponseSchema } from './schemas/user-create.schema';
import { FastifySwaggerSchema } from '../../types/fastify-swagger.type';

export async function UserRoutes(fastify: FastifyInstance) {
  const userController = fastify.diContainer.resolve<UserController>('userController');

  fastify.post<{ Body: CreateUserBody }>('/create', {
    schema: {
      body: createUserBodySchema,
      response:{
        201: CreateUserResponseSchema
      },
      tags: ['User'],
      description:'user creation endpoint'
    } as FastifySwaggerSchema,
  }, async (req: FastifyRequest<{ Body: CreateUserBody }>, reply: FastifyReply) => {
    return userController.create(req, reply);
  });
}