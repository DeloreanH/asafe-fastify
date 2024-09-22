import { PrismaClient } from "@prisma/client";

export class HealthService {
  constructor(private prisma: PrismaClient) { }

  getHealth(): string {
    return 'OK';
  }

  async getDatabaseHealth(): Promise<string> {
    try {
      await this.prisma.$executeRaw`SELECT 1`;
      return 'OK';
    } catch (error) {
      console.error('Database health check failed:', error);
      return 'FAIL';
    }
  }
}