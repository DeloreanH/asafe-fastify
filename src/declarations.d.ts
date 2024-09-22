import 'fastify';

declare module 'fastify' {
  interface PassportUser {
    id: string; // Add any other properties you expect from the user object
    username: string;
  }
}