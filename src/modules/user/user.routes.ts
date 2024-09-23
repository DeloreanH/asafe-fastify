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
import { mimeTypeHook } from '../../hooks/mimetype.hook';

export async function UserRoutes(fastify: FastifyInstance) {
  const userController = fastify.diContainer.resolve<UserController>('userController');

  fastify.post<{ Body: CreateUserBody }>('', {
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

  fastify.get('', {
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

  // This endpoint allows users to update their avatar by uploading a new image file.
    // Ensure to include authentication in the request as specified by the preValidation hook.

    // There is a conflict between the Fastify Swagger implementation and Fastify Multipart handling.
    // When the Swagger annotations are set for this route, it may trigger validation errors 
    // even when the proper data is provided through a file upload.
    //
    // To test this endpoint correctly:
    // 1. Use Postman and set the request body type to "form-data".
    // 2. Ensure you include the file in the "avatar" field.
    // 3. Refer to the README.md for additional instructions on how to configure the request.
  fastify.patch('/avatar',{
    preValidation: [authHook],
    schema:{
      response: { 200: updateUserResponseSchema },
      tags: ['User'],
      description: 'USE POSTMAN - see readme.md',
    }
  }, async (req, reply) => {
    const result = await userController.updateAvatar(req, reply);
    reply.send(result);
  });
}
