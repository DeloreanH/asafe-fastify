import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from './auth.service';
import { LoginBody } from './schemas/login.schema';
import { signUpBody } from './schemas/signup.schema';

export class AuthController {
  constructor(private authService: AuthService) { }

  async login(
    request: FastifyRequest<{ Body: LoginBody }>,
    reply: FastifyReply) {
    const tokenData = await this.authService.login(request.body);
    reply.send(tokenData);
  }

  async signup(
    request: FastifyRequest<{ Body: signUpBody }>,
    reply: FastifyReply) {
    const signedUp = await this.authService.login(request.body);
    reply.send(signedUp);
  }
}