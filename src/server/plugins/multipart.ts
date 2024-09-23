import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

async function multipartPlugin(fastify: FastifyInstance) {
  fastify.register(require('@fastify/multipart'), {
    limits: {
      fieldNameSize: 100,
      fieldSize: 100,
      fields: 10,
      fileSize: 10485760 ,  // Max file size
      files: 1,           // Max number of files
      headerPairs: 2000,
      parts: 1000
    }
  });
  fastify.log.info('Multipart support enabled');
}

export default fp(multipartPlugin, {
  name: 'multipartPlugin',
});