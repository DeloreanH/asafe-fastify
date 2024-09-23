import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { CreatePostBody, createPostBodySchema, CreatePostResponseSchema } from './schemas/post-create.schema';
import { UpdatePostBody, updatePostBodySchema, updatePostResponseSchema } from './schemas/post-update.schema';
import { PostController } from './post.controller';
import { Permission, roleHook } from '../../hooks/role.hook';
import { findAllPostsSchema } from './schemas/find-all-posts.schema';
import { postFindSchema } from './schemas/post-find.schema';
import { uIdParamsSchema } from '../../schemas/id-param.schema';
import { authHook } from '../../hooks/auth.hook';
import { FastifySwaggerSchema } from '../../types/fastify-swagger.type';

export async function PostRoutes(fastify: FastifyInstance) {
  const postController = fastify.diContainer.resolve<PostController>('postController');

  fastify.post<{ Body: CreatePostBody }>('', {
    preValidation: [authHook, roleHook([Permission.WriteOwn])],
    schema: {
      body: createPostBodySchema,
      response: {
        201: CreatePostResponseSchema,
      },
      tags: ['Post'],
      description: 'Post creation endpoint',
    } as FastifySwaggerSchema,
  }, async (req: FastifyRequest<{ Body: CreatePostBody }>, reply: FastifyReply) => {
    return postController.create(req, reply);
  });

  fastify.get('', {
    preValidation: [authHook, roleHook([Permission.ReadOwn])],
    schema: {
      response: {
        200: findAllPostsSchema,
      },
      tags: ['Post'],
      description: 'Get all user posts',
    } as FastifySwaggerSchema,
  }, async (req: FastifyRequest, reply: FastifyReply) => {
    return postController.findAll(req, reply);
  });

  fastify.get<{ Params: { uuid: string } }>('/:uuid', {
    preValidation: [authHook, roleHook([Permission.ReadOwn])],
    schema: {
      params: uIdParamsSchema,
      response: { 200: postFindSchema },
      tags: ['Post'],
      description: 'Get post by UUID',
    } as FastifySwaggerSchema,
  }, async (req: FastifyRequest<{ Params: { uuid: string } }>, reply: FastifyReply) => {
    return postController.findByUid(req, reply);
  });

  fastify.patch<{ Params: { uuid: string }; Body: UpdatePostBody }>('/:uuid', {
    preValidation: [authHook, roleHook([Permission.WriteOwn])],
    schema: {
      params: uIdParamsSchema,
      body: updatePostBodySchema,
      response: { 200: updatePostResponseSchema },
      tags: ['Post'],
      description: 'Update post by UUID',
    } as FastifySwaggerSchema,
  }, async (req: FastifyRequest<{ Params: { uuid: string }; Body: UpdatePostBody }>, reply: FastifyReply) => {
    return postController.update(req, reply);
  });

  fastify.delete<{ Params: { uuid: string } }>('/:uuid', {
    preValidation: [authHook, roleHook([Permission.DeleteOwn])],
    schema: {
      params: uIdParamsSchema,
      response: {
        204: {
          description: 'Post deleted',
        },
      },
      tags: ['Post'],
      description: 'Delete post by UUID',
    } as FastifySwaggerSchema,
  }, async (req: FastifyRequest<{ Params: { uuid: string } }>, reply: FastifyReply) => {
    return await postController.delete(req, reply);
  });
}
