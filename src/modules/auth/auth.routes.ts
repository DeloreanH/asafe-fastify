import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AuthController } from './auth.controller';
import { FastifySwaggerSchema } from '../../types/fastify-swagger.type';
import { LoginBody, LoginBodySchema, LoginResponseSchema } from './schemas/login.schema';
import { signUpBody, signUpBodySchema, signUpResponseSchema } from './schemas/signup.schema';

export async function authRoutes(fastify: FastifyInstance) {
  const authController = fastify.diContainer.resolve<AuthController>('authController');

  fastify.post('/login', {
    schema: {
      body: LoginBodySchema,
      response: {
        201: LoginResponseSchema
      },
      tags: ['Auth'],
      description: 'auth login endpoint'
    } as FastifySwaggerSchema,
  }, (req: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => authController.login(req, reply));

  fastify.post('/signup', {
    schema: {
      body: signUpBodySchema,
      response: {
        201: signUpResponseSchema
      },
      tags: ['Auth'],
      description: 'auth signup endpoint'
    } as FastifySwaggerSchema,
  }, (req: FastifyRequest<{ Body: signUpBody }>, reply: FastifyReply) => authController.signup(req, reply));
}