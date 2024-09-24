import { FastifyInstance } from 'fastify';
import { config } from '../config';
import { prisma } from './prisma/client';
import { fastifyAwilixPlugin } from '@fastify/awilix';
import { asValue, createContainer, InjectionMode } from 'awilix';
import { coreModules, registerRoutes } from '../modules/core';
import AutoLoad from '@fastify/autoload';
import Cors from '@fastify/cors';
import Helmet from '@fastify/helmet';
import path from 'path';
import fastifyJWT from 'fastify-jwt';

export default async function setupFastifyApp(fastify: FastifyInstance) {

  // helmet
  await fastify.register(Helmet, {
    global: true,
    contentSecurityPolicy: !config.isDevelopment,
    crossOriginEmbedderPolicy: !config.isDevelopment,
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

  // fastify jwt
  fastify.register(fastifyJWT, {
    secret: config.jwt.secret,
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