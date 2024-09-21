import { createContainer, asClass, InjectionMode } from 'awilix';

export function createTestContainer(mockServices: { [key: string]: any }) {
    const container = createContainer({ injectionMode: InjectionMode.CLASSIC });
    
    Object.entries(mockServices).forEach(([key, mockService]) => {
        container.register({
            [key]: asClass(mockService).singleton(),
        });
    });

    return container;
}