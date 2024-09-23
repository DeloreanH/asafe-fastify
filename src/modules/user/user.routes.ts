import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { CreateUserBody, createUserBodySchema, CreateUserResponseSchema } from './schemas/user-create.schema';
import { updateUserBody, updateUserBodySchema, updateUserResponseSchema } from './schemas/user-update.schema';
import { UserController } from './user.controller';
import { Permission, roleHook } from '../../hooks/role.hook';
import { findAllUserSchema } from './schemas/find-all-users.schema';
import { findUserSchema } from './schemas/find-user.schema';
import { idParamsSchema } from '../../schemas/id-param.schema';
import { authHook } from '../../hooks/auth.hook';

export async function UserRoutes(fastify: FastifyInstance) {
  const userController = fastify.diContainer.resolve<UserController>('userController');

  fastify.post<{ Body: CreateUserBody }>('/create', {
    preValidation: [authHook, roleHook([Permission.WriteAll])],
    schema: {
      body: createUserBodySchema,
      response: {
        201: CreateUserResponseSchema,
      },
      tags: ['User'],
      description: 'User creation endpoint',
    },
  }, async (req: FastifyRequest<{ Body: CreateUserBody }>, reply: FastifyReply) => {
    return userController.create(req, reply);
  });

  fastify.get('/users', {
    preValidation: [authHook, roleHook([Permission.WriteAll])],
    schema: {
      response: {
        200: findAllUserSchema,
      },
      tags: ['User'],
      description: 'Get all users',
    },
  }, async (req: FastifyRequest, reply: FastifyReply) => {
    return userController.findAll(req, reply);
  });

  fastify.get<{ Params: { id: number } }>('/users/:id', {
    preValidation: [authHook, roleHook([Permission.ReadAll])],
    schema: {
      params: idParamsSchema,
      response: { 200: findUserSchema },
      tags: ['User'],
      description: 'Get user by ID',
    },
  }, async (req: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
    return userController.findById(req, reply);
  });

  fastify.patch<{ Params: { id: number }; Body: updateUserBody }>('/users/:id', {
    preValidation: [authHook, roleHook([Permission.WriteAll])],
    schema: {
      params: idParamsSchema,
      body: updateUserBodySchema,
      response: { 200: updateUserResponseSchema },
      tags: ['User'],
      description: 'Update user by ID',
    },
  }, async (req: FastifyRequest<{ Params: { id: number }; Body: updateUserBody }>, reply: FastifyReply) => {
    return userController.update(req, reply);
  });

  fastify.delete<{ Params: { id: number } }>('/users/:id', {
    preValidation: [authHook, roleHook([Permission.DeleteAll])],
    schema: {
      params: idParamsSchema,
      response: {
        204: {
          description: 'User deleted',
        },
      },
      tags: ['User'],
      description: 'Delete user by ID',
    },
  }, async (req: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
    return await userController.delete(req, reply);
  });
}
