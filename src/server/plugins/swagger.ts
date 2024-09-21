import Swagger from '@fastify/swagger';
import SwaggerUI from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

async function swaggerGeneratorPlugin(fastify: FastifyInstance) {
  await fastify.register(Swagger, {
    openapi: {
      openapi: '3.1.0',
      info: {
        title: 'fastify-boilerplate',
        description:
          'The Swagger API documentation for the fastify-boilerplate project.',
        version: process.env.npm_package_version ?? '0.0.0',
      },
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
