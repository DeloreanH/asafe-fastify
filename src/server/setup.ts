import { FastifyInstance } from 'fastify';
import { env } from '../config';
import AutoLoad from '@fastify/autoload';
import Cors from '@fastify/cors';
import Helmet from '@fastify/helmet';
import path from 'path';
import { fastifyAwilixPlugin } from '@fastify/awilix';
import { asValue, createContainer, InjectionMode } from 'awilix';
import { coreModules, registerRoutes } from '../modules/core';
import { prisma } from './prisma/client';

export default async function setupFastifyApp(fastify: FastifyInstance) {

  // helmet
  await fastify.register(Helmet, {
    global: true,
    contentSecurityPolicy: !env.isDevelopment,
    crossOriginEmbedderPolicy: !env.isDevelopment,
  });

  // cors
  await fastify.register(Cors, {
    origin: false,
  });

  // Auto-load plugins
  await fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    dirNameRoutePrefix: false,
  });

  // di injection
  const container = createContainer({
    injectionMode: InjectionMode.CLASSIC,
  });


  container.register({
    prisma: asValue(prisma),
    ...coreModules(),
    logger: asValue(fastify.log),
  });

  await fastify.register(fastifyAwilixPlugin, {
    container: container,
    asyncInit: true,
  });

  // route registration
  await registerRoutes(fastify)

  return fastify;
}