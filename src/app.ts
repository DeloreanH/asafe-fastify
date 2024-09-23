import { env } from '../src/config';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import setupFastifyApp from './server/setup';
import Fastify from 'fastify';

async function init() {
  const fastify = Fastify({
    logger: {
      level: env.log.level,
      redact: ['headers.authorization'],
    },
    ignoreDuplicateSlashes: true,
  }).withTypeProvider<TypeBoxTypeProvider>();

  await setupFastifyApp(fastify);

  try {
    await fastify.listen({ port: env.server.port });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

init();
