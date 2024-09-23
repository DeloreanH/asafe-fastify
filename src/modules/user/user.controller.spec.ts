import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FastifyRequest, FastifyReply } from 'fastify';
import { createContainer, asValue, asClass, InjectionMode } from 'awilix';
import { Role as PrismaRole } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { UpdateUserBody } from './schemas/user-update.schema';
import { CreateUserBody } from './schemas/user-create.schema';
import { WebSocketService } from '../websocket/websocket.service';

describe('UserController', () => {
    let userController: UserController;
    let userService: jest.Mocked<UserService>;
    let webSocketService: jest.Mocked<WebSocketService>;
    let mockRequest: FastifyRequest;
    let mockReply: FastifyReply;

    beforeEach(() => {
        jest.clearAllMocks();

        userService = {
            findByEmail: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            findByUid: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        } as unknown as jest.Mocked<UserService>;

        webSocketService = {
            emitUserUpdate: jest.fn(),
        } as unknown as jest.Mocked<WebSocketService>;

        const container = createContainer({
            injectionMode: InjectionMode.CLASSIC,
        });

        container.register({
            userService: asValue(userService),
            webSocketService: asValue(webSocketService),
            userController: asClass(UserController),
        });

        userController = container.resolve<UserController>('userController');

        mockRequest = {} as unknown as FastifyRequest;
        mockReply = {
            send: jest.fn(),
            status: jest.fn().mockReturnThis(),
        } as unknown as FastifyReply;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should return all users', async () => {
            const mockUsers = [{
                id: 1,
                uuid: uuidv4(),
                name: 'John Doe',
                email: 'john@doe.com',
                password: 'hashed_password',
                role: PrismaRole.BASIC,
                createdAt: new Date(),
                updatedAt: new Date(),
            }];

            userService.findAll.mockResolvedValue(mockUsers);

            await userController.findAll(mockRequest as FastifyRequest, mockReply as FastifyReply);

            expect(userService.findAll).toHaveBeenCalledTimes(1);
            expect(mockReply.send).toHaveBeenCalledWith(mockUsers);
        });
    });

    describe('findByUid', () => {
        it('should return a user by uuid', async () => {
            const uuid = uuidv4();
            const mockUser = {
                id: 1,
                uuid,
                name: 'John Doe',
                email: 'john@doe.com',
                password: 'hashed_password',
                role: PrismaRole.BASIC,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            userService.findByUid.mockResolvedValue(mockUser);

            mockRequest = {
                params: { uuid },
            } as FastifyRequest;

            await userController.findByUid(mockRequest as FastifyRequest<{ Params: { uuid: string } }>, mockReply as FastifyReply);

            expect(userService.findByUid).toHaveBeenCalledWith(uuid);
            expect(mockReply.send).toHaveBeenCalledWith(mockUser);
        });
    });

    describe('create', () => {
        it('should create a new user', async () => {
            const userData = { name: 'John Doe', email: 'john@doe.com', password: 'password' };
            const mockUser = {
                id: 1,
                uuid: uuidv4(),
                ...userData,
                password: 'hashed_password',
                role: PrismaRole.BASIC,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            userService.create.mockResolvedValue(mockUser);
            mockRequest.body = userData;

            await userController.create(mockRequest as FastifyRequest<{ Body: CreateUserBody }>, mockReply as FastifyReply);

            expect(userService.create).toHaveBeenCalledWith(userData);
            expect(mockReply.status).toHaveBeenCalledWith(201);
            expect(mockReply.send).toHaveBeenCalledWith(mockUser);
        });
    });

    describe('update', () => {
        it('should update a user', async () => {
            const userData = { name: 'new John Name' };
            const uuid = uuidv4();
            const mockUser = {
                id: 1,
                uuid,
                name: userData.name,
                email: 'john@doe.com',
                password: 'hashed_password',
                role: PrismaRole.BASIC,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            userService.update.mockResolvedValue(mockUser);
            mockRequest.params = { uuid };
            mockRequest.body = userData;

            await userController.update(mockRequest as FastifyRequest<{ Params: { uuid: string }; Body: UpdateUserBody }>, mockReply as FastifyReply);

            expect(userService.update).toHaveBeenCalledWith(uuid, userData);
            expect(webSocketService.emitUserUpdate).toHaveBeenCalledWith(expect.objectContaining({
                id: mockUser.id,
                uuid: mockUser.uuid,
                name: mockUser.name,
                email: mockUser.email,
                role: mockUser.role,
            }));
            expect(mockReply.send).toHaveBeenCalledWith(mockUser);
        });
    });

    describe('delete', () => {
        it('should delete a user', async () => {
            const uuid = uuidv4();
            mockRequest.params = { uuid };

            await userController.delete(mockRequest as FastifyRequest<{ Params: { uuid: string } }>, mockReply as FastifyReply);

            expect(userService.delete).toHaveBeenCalledWith(uuid);
            expect(mockReply.status).toHaveBeenCalledWith(204);
            expect(mockReply.send).toHaveBeenCalled();
        });
    });
});
