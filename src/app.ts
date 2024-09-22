import { env } from '../src/config';
import setupFastifyApp from './server/setup';
import Fastify from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

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
