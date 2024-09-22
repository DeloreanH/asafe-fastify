import { FastifySchema } from "fastify";

export interface FastifySwaggerSchema extends FastifySchema {
    tags?: string[];
    summary?: string;
    description?: string;
  }
  