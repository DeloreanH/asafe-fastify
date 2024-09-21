import { FastifyRequest, FastifyReply } from 'fastify';
import { HealthController } from './health.controller';
import { createTestContainer } from '../../utils/test.util';

class MockHealthService {
    getHealth = jest.fn().mockReturnValue('OK');
}

describe('HealthController', () => {
    let healthController: HealthController;
    let mockRequest: Partial<FastifyRequest>;
    let mockReply: Partial<FastifyReply>;

    beforeEach(() => {

        const container = createTestContainer({
            healthService: MockHealthService,
            healthController: HealthController,
        });
        healthController = container.resolve<HealthController>('healthController');

        mockRequest = {};
        mockReply = {
            send: jest.fn(), 
        };
    });

    it('should return health status', async () => {
        await healthController.checkHealth(mockRequest as FastifyRequest, mockReply as FastifyReply);
        expect(mockReply.send).toHaveBeenCalledWith({ status: 'OK' });
    });
});