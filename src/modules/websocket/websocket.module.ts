
import { asClass } from 'awilix';
import { WebSocketService } from './websocket.service';

export const websocketModule = {
    webSocketService: asClass(WebSocketService).singleton(),
};