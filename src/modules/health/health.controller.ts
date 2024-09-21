import { FastifyReply, FastifyRequest } from 'fastify';
import { HealthService } from './health.service'; 

export class HealthController {
    constructor(private healthService: HealthService) {
        console.log("HealthController initialized with HealthService:", healthService);
      }

  async checkHealth(req: FastifyRequest, reply: FastifyReply) {
    const status = this.healthService.check();
    reply.send({ status });
  }
}