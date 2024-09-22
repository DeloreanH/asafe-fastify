import { FastifyReply, FastifyRequest } from 'fastify';
import { HealthService } from './health.service';

export class HealthController {
  constructor(private healthService: HealthService) { }

  async getHealth(req: FastifyRequest, reply: FastifyReply) {
    const status = this.healthService.getHealth();
    reply.send(status);
  }

  async getDatabaseHealth(req: FastifyRequest, reply: FastifyReply) {
    const status = await this.healthService.getDatabaseHealth();
    reply.send(status);
  }
}