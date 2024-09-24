import { Static, Type } from '@sinclair/typebox';
import envSchema from 'env-schema';

enum NodeEnv {
  development = 'development',
  production = 'production',
  test = 'test',
}

export enum LogLevel {
  debug = 'debug',
  info = 'info',
  warn = 'warn',
  error = 'error',
}

const schema = Type.Object({
  POSTGRES_URL: Type.String(),
  POSTGRES_PASSWORD: Type.String(),
  POSTGRES_USER: Type.String(),
  POSTGRES_DB: Type.String(),
  LOG_LEVEL: Type.Enum(LogLevel),
  NODE_ENV: Type.Enum(NodeEnv),
  HOST: Type.String({ default: 'localhost' }),
  PORT: Type.Number({ default: 3000 }),
  JWT_SECRET: Type.String(),
  JWT_EXPIRE_TIME: Type.Number({ default: 3600 }),
  BUCKET_NAME: Type.String({ default: 'fasty-avatar' }),
});

const env = envSchema<Static<typeof schema>>({
  dotenv: true,
  schema,
});

export const config = {
  nodeEnv: env.NODE_ENV,
  isDevelopment: env.NODE_ENV === NodeEnv.development,
  isProduction: env.NODE_ENV === NodeEnv.production,
  version: process.env.npm_package_version ?? '0.0.0',
  log: {
    level: env.LOG_LEVEL,
  },
  server: {
    host: env.HOST,
    port: env.PORT ?? 3000,
  },
  db: {
    url: `postgres://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.POSTGRES_URL}/${env.POSTGRES_DB}?sslmode=disable`,
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRE_TIME
  },
  gcc:{
    svc: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    bucketName: env.BUCKET_NAME
  }
};
