import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

async function multipartPlugin(fastify: FastifyInstance) {
  fastify.register(require('@fastify/multipart'), {
    limits: {
      fileSize: 50 * 1024 * 1024, // Max file size in bytes (50 MB)
      files: 1,                 // Max number of file fields
    }
  });
  fastify.log.info('Multipart support enabled');
}

export default fp(multipartPlugin, {
  name: 'multipartPlugin',
});