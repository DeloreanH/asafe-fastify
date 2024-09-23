import { FastifyInstance } from 'fastify';
import { healthModule } from './health/health.module';
import { healthRoutes } from './health/health.routes';
import { userModule } from './user/user.module';
import { UserRoutes } from './user/user.routes';
import { authRoutes } from './auth/auth.routes';
import { AuthModule } from './auth/auth.module';
import { websocketRoutes } from './websocket/websocket.routes';
import { websocketModule } from './websocket/websocket.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { postModule } from './post/post.module';
import { PostRoutes } from './post/post.routes';

export function coreModules() {
  return {

    ...healthModule,
    ...userModule,
    ...AuthModule,
    ...websocketModule,
    ...FileUploadModule,
    ...postModule
  };
}

export async function registerRoutes(fastify: FastifyInstance) {
  await fastify.register(authRoutes, { prefix: '/auth' });
  await fastify.register(healthRoutes, { prefix: '/health' });
  await fastify.register(UserRoutes, { prefix: '/user' });
  await fastify.register(PostRoutes, { prefix: '/posts' });
  await websocketRoutes(fastify);
}