import { FastifyInstance } from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import { WebSocketService } from './websocket.service';

export async function websocketRoutes(fastify: FastifyInstance) {
    await fastify.register(fastifyWebsocket);

    const webSocketService = fastify.diContainer.resolve<WebSocketService>('webSocketService');

    fastify.get('/ws/conn', { websocket: true }, (connection) => {
        webSocketService.addConnection(connection);
        connection.on('message', (message: string) => {
            fastify.log.info('Received message from client:', message);
        });
    });
}