import { FastifyInstance } from 'fastify';
import { healthModule } from './health/health.module';
import { healthRoutes } from './health/health.routes';
import { userModule } from './user/user.module';
import { UserRoutes } from './user/user.routes';

export function coreModules() {
  return {
    ...healthModule,
    ...userModule
  };
}

export async function registerRoutes(fastify: FastifyInstance) {
  await fastify.register(healthRoutes, { prefix: '/health' });
  await fastify.register(UserRoutes, { prefix: '/user' });
}