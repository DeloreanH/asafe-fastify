import { FastifyInstance } from 'fastify';
import { HealthController } from './health.controller';
import { HealthResponseSchema } from './schemas/health.schema';
import { FastifySwaggerSchema } from '../../types/fastify-swagger.type';
import { authHook } from '../../hooks/auth.hook';

export async function healthRoutes(fastify: FastifyInstance) {
  const healthController = fastify.diContainer.resolve<HealthController>('healthController');

  fastify.get('', {
    schema: {
      response: {
        200: HealthResponseSchema
      },
      tags:['Health'],
    } as FastifySwaggerSchema
  }, (req, reply) => healthController.getHealth(req, reply));

  fastify.get('/db', {
    preValidation: [authHook], 
    schema: {
      response: {
        200: HealthResponseSchema
      },
      tags:['Health'],
      security: [{ bearerAuth: [] } ],
    } as FastifySwaggerSchema,
  }, (req, reply) => healthController.getDatabaseHealth(req, reply));
}