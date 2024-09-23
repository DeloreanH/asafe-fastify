import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FastifyRequest, FastifyReply } from 'fastify';
import { createContainer, asValue, asClass, InjectionMode } from 'awilix';
import { Role as PrismaRole } from '@prisma/client';
import { updateUserBody } from './schemas/user-update.schema';
import { CreateUserBody } from './schemas/user-create.schema';

describe('UserController', () => {
    let userController: UserController;
    let userService: jest.Mocked<UserService>;
    let mockRequest: FastifyRequest;
    let mockReply: FastifyReply;

    beforeEach(() => {
        jest.clearAllMocks();

        userService = {
            findByEmail: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        } as unknown as jest.Mocked<UserService>;

        const container = createContainer({
            injectionMode: InjectionMode.CLASSIC,
        });

        container.register({
            userService: asValue(userService),
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

    describe('findById', () => {
        it('should return a user by id', async () => {
            const mockUser = {
                id: 1,
                name: 'John Doe',
                email: 'john@doe.com',
                password: 'hashed_password',
                role: PrismaRole.BASIC,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            userService.findById.mockResolvedValue(mockUser);

            mockRequest = {
                params: { id: 1 },
            } as FastifyRequest;

            await userController.findById(mockRequest as FastifyRequest<{ Params: { id: number } }>, mockReply as FastifyReply);

            expect(userService.findById).toHaveBeenCalledWith(1);
            expect(mockReply.send).toHaveBeenCalledWith(mockUser);
        });
    });

    describe('create', () => {
        it('should create a new user', async () => {
            const userData = { name: 'John Doe', email: 'john@doe.com', password: 'password' };
            const mockUser = {
                id: 1,
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
            const mockUser = {
                id: 1,
                name: userData.name,
                email: 'john@doe.com',
                password: 'hashed_password',
                role: PrismaRole.BASIC,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            userService.update.mockResolvedValue(mockUser);
            mockRequest.params = { id: 1 };
            mockRequest.body = userData;

            await userController.update(mockRequest as FastifyRequest<{ Params: { id: number }; Body: updateUserBody }>, mockReply as FastifyReply);

            expect(userService.update).toHaveBeenCalledWith(1, userData);
            expect(mockReply.send).toHaveBeenCalledWith(mockUser);
        });
    });

    describe('delete', () => {
        it('should delete a user', async () => {
            mockRequest.params = { id: 1 };

            await userController.delete(mockRequest as FastifyRequest<{ Params: { id: number } }>, mockReply as FastifyReply);

            expect(userService.delete).toHaveBeenCalledWith(1);
            expect(mockReply.status).toHaveBeenCalledWith(204);
            expect(mockReply.send).toHaveBeenCalled();
        });
    });
});
