import 'fastify';

declare module 'fastify' {
  interface PassportUser {
    id: number;
    uuid: string;
    role: string;
  }

  interface FastifyRequest {
    user: {
      id: number;
      uuid: string;
      role: string;
    };
  }
  interface FastifyRequest {
    file: () => Promise<FastifyFile | null>;
    files: () => Promise<FastifyFile[]>;
  }
}