import Swagger from '@fastify/swagger';
import SwaggerUI from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

async function swaggerGeneratorPlugin(fastify: FastifyInstance) {
  await fastify.register(Swagger,  {
    openapi: {
      info: {
        title: 'User API',
        description: 'API for user management',
        version: process.env.npm_package_version ?? '0.0.0',
      },
      components: {
        securitySchemes: {
          apiKey: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
          },
        },
      },
      security: [{ apiKey: [] }],
    },
  });

  await fastify.register(SwaggerUI, {
    routePrefix: '/api-docs',
  });

  fastify.log.info(`Swagger documentation is available at /api-docs`);
}

export default fp(swaggerGeneratorPlugin, {
  name: 'swaggerGenerator',
});
