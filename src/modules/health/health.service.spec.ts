import { HealthService } from './health.service';

describe('HealthService', () => {
    let healthService: HealthService;

    beforeEach(() => {
        healthService = new HealthService();
    });

    it('should return "OK" for health status', () => {
        const status = healthService.getHealth();
        expect(status).toBe('OK');
    });
});