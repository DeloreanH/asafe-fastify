import { HealthController } from "./health.controller";
import { HealthService } from "./health.service";
import { asClass } from 'awilix';

export const healthModule = {
    healthService: asClass(HealthService).singleton(),
    healthController: asClass(HealthController).singleton(),
}