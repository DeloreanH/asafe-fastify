import { FastifyReply, FastifyRequest } from 'fastify';
import { HealthService } from './health.service';

export class HealthController {
  constructor(private healthService: HealthService) { }

  async checkHealth(req: FastifyRequest, reply: FastifyReply) {
    const status = this.healthService.getHealth();
    reply.send({ status });
  }
}