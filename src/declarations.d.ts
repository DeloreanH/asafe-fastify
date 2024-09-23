import 'fastify';

declare module 'fastify' {
  interface PassportUser {
    id: number;
    uuid: string;
    role: string;
  }
}