import { WebSocket } from 'ws';
import { WebSocketService } from './websocket.service';
import { createContainer, asClass, InjectionMode } from 'awilix';
import { Role as PrismaRole } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';


// Extend the WebSocket type to include closeCallback
interface MockedWebSocket extends WebSocket {
  closeCallback?: () => void;
}

describe('WebSocketService', () => {
  let webSocketService: WebSocketService;
  let mockSocket: jest.Mocked<MockedWebSocket>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSocket = {
      readyState: WebSocket.OPEN,
      send: jest.fn(),
      on: jest.fn((event, callback) => {
        if (event === 'close') { // control the close event
          mockSocket.closeCallback = callback;
        }
      }),
    } as unknown as jest.Mocked<MockedWebSocket>;

    const container = createContainer({
      injectionMode: InjectionMode.CLASSIC,
    });

    container.register({
      webSocketService: asClass(WebSocketService),
    });

    webSocketService = container.resolve<WebSocketService>('webSocketService');
  });

  describe('addConnection', () => {
    it('should add a new connection and listen for close event', () => {
      webSocketService.addConnection(mockSocket);

      expect(webSocketService.getActiveConnections()).toContain(mockSocket);
      expect(mockSocket.on).toHaveBeenCalledWith('close', expect.any(Function));
    });

    it('should remove the connection when the socket closes', () => {
      webSocketService.addConnection(mockSocket);

      // Manually invoke the close callback to simulate the socket closing
      mockSocket.closeCallback!(); // non-null assertion, closeCallback is defined

      expect(webSocketService.getActiveConnections()).not.toContain(mockSocket);
    });
  });

  describe('sendToAll', () => {
    it('should send a message to all active connections', () => {
      const anotherMockSocket = {
        readyState: WebSocket.OPEN,
        send: jest.fn(),
        on: jest.fn(),
      } as unknown as jest.Mocked<MockedWebSocket>;

      webSocketService.addConnection(mockSocket);
      webSocketService.addConnection(anotherMockSocket);

      webSocketService.sendToAll('Hello');

      expect(mockSocket.send).toHaveBeenCalledWith('Hello');
      expect(anotherMockSocket.send).toHaveBeenCalledWith('Hello');
    });

    it('should not send a message to closed connections', () => {
      const closedMockSocket = {
        readyState: WebSocket.CLOSED,
        send: jest.fn(),
        on: jest.fn(), // Mock `on` to prevent errors
      } as unknown as jest.Mocked<MockedWebSocket>;

      webSocketService.addConnection(closedMockSocket);

      webSocketService.sendToAll('Hello');

      expect(closedMockSocket.send).not.toHaveBeenCalled();
    });
  });

  describe('emitUserUpdate', () => {
    it('should send a user update message to all active connections', () => {
      webSocketService.addConnection(mockSocket);

      const filteredValues = {
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUser = {
        id: 1,
        uuid: uuidv4(),
        name: 'new John Name',
        email: 'john@doe.com',
        role: PrismaRole.BASIC,
      };

      const prismaUserMock = { ...filteredValues, ...mockUser };

      webSocketService.emitUserUpdate(prismaUserMock);
      expect(mockSocket.send).toHaveBeenCalledWith(JSON.stringify({ event: 'userUpdated', data: mockUser }));

    });
  });
});
