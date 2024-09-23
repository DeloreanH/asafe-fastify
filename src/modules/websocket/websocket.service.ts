import { WebSocket } from 'ws';
import { updateUserResponseSchema } from '../user/schemas/user-update.schema';
import { Value } from '@sinclair/typebox/value'
import { User } from '@prisma/client';

export class WebSocketService {
  private activeConnections: WebSocket[] = [];
  
  addConnection(socket: WebSocket) {
    this.activeConnections.push(socket);

    // Handle the socket close event
    socket.on('close', () => {
      this.removeConnection(socket);
    });
  }

  private removeConnection(socket: WebSocket) {
    const index = this.activeConnections.indexOf(socket);
    if (index !== -1) {
      this.activeConnections.splice(index, 1);
    }
  }

  // Send a message to all connected clients
  sendToAll(message: string) {
    this.activeConnections.forEach((socket) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(message);
      }
    });
  }

  // Emit user update event
  emitUserUpdate(user: User) {
    const cleanedUser = Value.Clean(updateUserResponseSchema, user);
    const message = JSON.stringify({ event: 'userUpdated', data: cleanedUser });
    this.sendToAll(message);
  }

  getActiveConnections() {
    return this.activeConnections;
  }
}