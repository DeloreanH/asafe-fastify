import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { CreateUserBody, createUserBodySchema, CreateUserResponseSchema } from './schemas/user-create.schema';
import { UpdateUserBody, updateUserBodySchema, updateUserResponseSchema } from './schemas/user-update.schema';
import { UserController } from './user.controller';
import { Permission, roleHook } from '../../hooks/role.hook';
import { findAllUserSchema } from './schemas/find-all-users.schema';
import { findUserSchema } from './schemas/find-user.schema';
import { uIdParamsSchema } from '../../schemas/id-param.schema';
import { authHook } from '../../hooks/auth.hook';
import { FastifySwaggerSchema } from '../../types/fastify-swagger.type';

export async function UserRoutes(fastify: FastifyInstance) {
  const userController = fastify.diContainer.resolve<UserController>('userController');

  fastify.post<{ Body: CreateUserBody }>('/', {
    preValidation: [authHook, roleHook([Permission.WriteAll])],
    schema: {
      body: createUserBodySchema,
      response: {
        201: CreateUserResponseSchema,
      },
      tags: ['User'],
      description: 'User creation endpoint',
    } as FastifySwaggerSchema,
  }, async (req: FastifyRequest<{ Body: CreateUserBody }>, reply: FastifyReply) => {
    return userController.create(req, reply);
  });

  fastify.get('/', {
    preValidation: [authHook, roleHook([Permission.WriteAll])],
    schema: {
      response: {
        200: findAllUserSchema,
      },
      tags: ['User'],
      description: 'Get all users',
    } as FastifySwaggerSchema,
  }, async (req: FastifyRequest, reply: FastifyReply) => {
    return userController.findAll(req, reply);
  });

  fastify.get<{ Params: { uuid: string } }>('/:uuid', {
    preValidation: [authHook, roleHook([Permission.ReadAll])],
    schema: {
      params: uIdParamsSchema,
      response: { 200: findUserSchema },
      tags: ['User'],
      description: 'Get user by UUID',
    } as FastifySwaggerSchema,
  }, async (req: FastifyRequest<{ Params: { uuid: string } }>, reply: FastifyReply) => {
    return userController.findByUid(req, reply);
  });

  fastify.patch<{ Params: { uuid: string }; Body: UpdateUserBody }>('/:uuid', {
    preValidation: [authHook, roleHook([Permission.WriteAll])],
    schema: {
      params: uIdParamsSchema,
      body: updateUserBodySchema,
      response: { 200: updateUserResponseSchema },
      tags: ['User'],
      description: 'Update user by UUID',
    } as FastifySwaggerSchema,
  }, async (req: FastifyRequest<{ Params: { uuid: string }; Body: UpdateUserBody }>, reply: FastifyReply) => {
    return userController.update(req, reply);
  });

  fastify.delete<{ Params: { uuid: string } }>('/:uuid', {
    preValidation: [authHook, roleHook([Permission.DeleteAll])],
    schema: {
      params: uIdParamsSchema,
      response: {
        204: {
          description: 'User deleted',
        },
      },
      tags: ['User'],
      description: 'Delete user by UUID',
    } as FastifySwaggerSchema,
  }, async (req: FastifyRequest<{ Params: { uuid: string } }>, reply: FastifyReply) => {
    return await userController.delete(req, reply);
  });
}
