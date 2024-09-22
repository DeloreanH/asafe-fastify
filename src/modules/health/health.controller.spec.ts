import { FastifyRequest, FastifyReply } from 'fastify';
import { HealthController } from './health.controller';
import { createContainer, asValue, asClass, InjectionMode } from 'awilix';
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { prisma } from '../../server/prisma/client';
import { HealthService } from './health.service';

jest.mock('../../server/prisma/client', () => {
    return {
        __esModule: true,
        prisma: mockDeep<PrismaClient>(),
    };
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const MockHealthService = {
    getHealth: jest.fn(),
    getDatabaseHealth: jest.fn(),
}

describe('HealthController', () => {
    let container;
    let healthController: HealthController;
    let healthService: HealthService;
    let mockRequest: Partial<FastifyRequest>;
    let mockReply: Partial<FastifyReply>;

    beforeEach(() => {
        jest.clearAllMocks();

        container = createContainer({
            injectionMode: InjectionMode.CLASSIC,
        });

        container.register({
            prisma: asValue(prismaMock),
            healthService: asValue(MockHealthService),
            healthController: asClass(HealthController),
        });

        healthController = container.resolve<HealthController>('healthController');
        healthService = container.resolve<HealthService>('healthService');

        mockRequest = {};
        mockReply = {
            send: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    it('should return health status', () => {
        const spy = jest.spyOn(healthService, 'getHealth').mockReturnValue('OK');
        healthController.getHealth(mockRequest as FastifyRequest, mockReply as FastifyReply);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(mockReply.send).toHaveBeenCalledWith({ status: 'OK' });
    });

    it('should return health status as OK when database is healthy', async () => {
        const spy = jest.spyOn(healthService, 'getDatabaseHealth').mockResolvedValueOnce('OK')
        await healthController.getDatabaseHealth(mockRequest as FastifyRequest, mockReply as FastifyReply);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(mockReply.send).toHaveBeenCalledWith({ status: 'OK' });
    });

    it('should return health status as FAIL when database is down', async () => {
        const spy = jest.spyOn(healthService, 'getDatabaseHealth').mockResolvedValueOnce('FAIL');
        await healthController.getDatabaseHealth(mockRequest as FastifyRequest, mockReply as FastifyReply);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(mockReply.send).toHaveBeenCalledWith({ status: 'FAIL' });
    });
});