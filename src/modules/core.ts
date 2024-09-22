import { FastifyInstance } from 'fastify';
import { healthModule } from './health/health.module';
import { healthRoutes } from './health/health.routes';
import { userModule } from './user/user.module';
import { UserRoutes } from './user/user.routes';
import { authRoutes } from './auth/auth.routes';
import { AuthModule } from './auth/auth.module';

export function coreModules() {
  return {
    ...healthModule,
    ...userModule,
    ...AuthModule
  };
}

export async function registerRoutes(fastify: FastifyInstance) {
  await fastify.register(authRoutes, { prefix: '/auth' });
  await fastify.register(healthRoutes, { prefix: '/health' });
  await fastify.register(UserRoutes, { prefix: '/user' });
}