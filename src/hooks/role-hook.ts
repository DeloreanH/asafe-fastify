
import { FastifyRequest, FastifyReply } from 'fastify';
import { ForbiddenException } from '../shared/exceptions';

export function roleHook(requiredRole: string) {
  return async (req: FastifyRequest, reply: FastifyReply) => {

    const user = req.user as { role: string };

    if (!user || user.role !== requiredRole) {
      throw new ForbiddenException();
    }
  };
}