import { FastifyInstance } from 'fastify';
import { HealthController } from './health.controller';

export async function healthRoutes(fastify: FastifyInstance) {
  const healthController = fastify.diContainer.resolve<HealthController>('healthController');
  
  fastify.get('/', (req, reply) => healthController.getHealth(req, reply));
  fastify.get('/db', (req, reply) => healthController.getDatabaseHealth(req, reply));
}