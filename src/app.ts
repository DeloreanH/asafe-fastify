import { env } from '../src/config';
import setupFastifyApp from './server/setup';
import Fastify from 'fastify';

async function init() {
  const fastify = Fastify({
    logger: {
      level: env.log.level,
      redact: ['headers.authorization'],
    },
    ignoreDuplicateSlashes: true,
    ajv: {
      customOptions: {
        keywords: ['example'],
      },
    },
  });

  await setupFastifyApp(fastify);

  try {
    await fastify.listen({ port: env.server.port });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

init();
