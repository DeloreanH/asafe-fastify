import { HealthService } from './health.service';
import { createContainer, asValue, asClass, InjectionMode } from 'awilix';
import { PrismaClient } from '@prisma/client'
import { mockDeep, DeepMockProxy } from 'jest-mock-extended'
import { prisma } from '../../server/prisma/client';

jest.mock('../../server/prisma/client', () => {
    return {
        __esModule: true,
        prisma: mockDeep<PrismaClient>(),
    };
});
export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe('HealthService', () => {
    let container;
    let healthService: HealthService;

    beforeEach(() => {
        jest.clearAllMocks();

        container = createContainer({
            injectionMode: InjectionMode.CLASSIC,
        });

        container.register({
            prisma: asValue(prismaMock),
            healthService: asClass(HealthService),
        });

        healthService = container.resolve<HealthService>('healthService');
    });

    it('should return "OK" for health status', () => {
        const spy = jest.spyOn(healthService, 'getHealth').mockReturnValue({status: 'OK'});
        const response = healthService.getHealth();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(response).toEqual({status: 'OK'});
    });

    it('should return health status as OK when database is healthy', async () => {
        prismaMock.$executeRaw.mockResolvedValueOnce(1);
        const response = await healthService.getDatabaseHealth();
        expect(prismaMock.$executeRaw).toHaveBeenCalledTimes(1);
        expect(response).toEqual({status: 'OK'});
    });

    it('should return health status as FAIL when database is down', async () => {
        prismaMock.$executeRaw.mockRejectedValueOnce(new Error('DB error'));
        const response = await healthService.getDatabaseHealth();
        expect(prismaMock.$executeRaw).toHaveBeenCalledTimes(1);
        expect(response).toEqual({status: 'FAIL'});
    });
});