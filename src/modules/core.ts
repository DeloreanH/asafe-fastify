import { FastifyInstance } from 'fastify';
import { healthModule } from './health/health.module';
import { healthRoutes } from './health/health.routes';

export function coreModules() {
  return {
    ...healthModule,
  };
}

export async function registerRoutes(fastify: FastifyInstance) {
  await fastify.register(healthRoutes);
}