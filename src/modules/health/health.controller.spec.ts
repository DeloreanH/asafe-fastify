import fastify, { FastifyInstance } from 'fastify';
import { createContainer, asClass, InjectionMode } from 'awilix';
import { HealthController } from './health.controller';
import { createTestContainer } from '../../utils/test.util';

class MockHealthService {
    getHealth = jest.fn().mockReturnValue('OK');
}

describe('HealthController', () => {
    let app: FastifyInstance;
    let healthController: HealthController;

    beforeEach(() => {
        app = fastify();

        const container = createTestContainer({
            healthService: MockHealthService,
            healthController: HealthController,
        });

        healthController = container.resolve<HealthController>('healthController');
        app.get('/health', (req, reply) => healthController.checkHealth(req, reply));
    });

    it('should return health status', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/health',
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({ status: 'OK' });
    });
})