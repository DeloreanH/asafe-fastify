import { WebSocket } from 'ws';

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
  emitUserUpdate(updatedUser: any) {
    const message = JSON.stringify({ event: 'userUpdated', data: updatedUser });
    this.sendToAll(message);
  }
}