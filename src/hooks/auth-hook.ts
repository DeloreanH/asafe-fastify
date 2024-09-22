import { FastifyRequest, FastifyReply } from 'fastify';
import { UnauthorizedException } from '../shared/exceptions';

export async function authHook(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
    // req.user is automatically populated by req.jwtVerify()
  } catch (err) {
    throw new UnauthorizedException();
  }
}