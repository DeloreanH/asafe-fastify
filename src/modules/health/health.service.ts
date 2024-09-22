import { PrismaClient } from "@prisma/client";
import { HealthResponse } from "./schemas/health.schema";

export class HealthService {
  constructor(private prisma: PrismaClient) { }

  getHealth(): HealthResponse {
    return { status: 'OK' };
  }

  async getDatabaseHealth(): Promise<HealthResponse> {
    try {
      await this.prisma.$executeRaw`SELECT 1`;
      return { status: 'OK' };
    } catch (error) {
      return { status: 'FAIL' };
    }
  }
}