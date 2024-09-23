import { asClass, asValue, createContainer, InjectionMode } from 'awilix';
import { AuthService } from './auth.service';
import { UserRepository } from '../user/user.repository';
import { ConflictException, UnauthorizedException } from '../../shared/exceptions';
import { Role as PrismaRole } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
    let container;
    let authService: AuthService;
    let userRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        jest.clearAllMocks();

        userRepository = {
            findByEmail: jest.fn(),
            create: jest.fn(),
        } as unknown as jest.Mocked<UserRepository>;


        process.env.JWT_SECRET = 'test-secret';
        process.env.JWT_EXPIRES_IN = '3600';

        container = createContainer({
            injectionMode: InjectionMode.CLASSIC,
        });

        container.register({
            userRepository: asValue(userRepository),
            authService: asClass(AuthService),
        });

        authService = container.resolve<AuthService>('authService');
    });

    describe('login', () => {
        it('should throw UnauthorizedException if user is not found', async () => {
            userRepository.findByEmail.mockResolvedValue(null);

            await expect(authService.login({ email: 'john@doe.com', password: 'password' }))
                .rejects
                .toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException if password is incorrect', async () => {
            const user = {
                id: 1,
                name: "John Doe",
                email: "john@doe.com",
                password: "123password",
                uuid: uuidv4(),
                role: PrismaRole.BASIC,
                avatar: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            userRepository.findByEmail.mockResolvedValue(user);

            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(authService.login({ email: 'john@doe.com', password: 'wrong-password' }))
                .rejects
                .toThrow(UnauthorizedException);
        });

        it('should return a JWT token if credentials are valid', async () => {
            const user = {
                id: 1,
                name: "John Doe",
                email: "john@doe.com",
                password: "123password",
                uuid: uuidv4(),
                avatar: null,
                role: PrismaRole.BASIC,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            userRepository.findByEmail.mockResolvedValue(user);

            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue('mocked-token');

            const result = await authService.login({ email: "john@doe.com", password: '123password' });

            expect(result).toEqual({
                token: 'mocked-token',
                expiresIn: 3600,
            });
        });
    });

    describe('signup', () => {
        it('should throw ConflictException if email already exists', async () => {
            const user = {
                id: 1,
                name: "John Doe",
                email: "john@doe.com",
                password: "123password",
                uuid: uuidv4(),
                avatar: null,
                role: PrismaRole.BASIC,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            userRepository.findByEmail.mockResolvedValue(user);

            await expect(authService.signup({
                name: "John Doe",
                email: "john@doe.com",
                password: "123password",
                role: PrismaRole.BASIC
            })).rejects.toThrow(ConflictException);
        });

        it('should create a new user if email does not exist', async () => {
            userRepository.findByEmail.mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue('123password');
            (jwt.sign as jest.Mock).mockReturnValue('mocked-token');

            const newUser = {
                id: 1,
                name: "John Doe",
                email: "john@doe.com",
                password: '123password',
                uuid: uuidv4(),
                avatar: null,
                role: PrismaRole.BASIC,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            userRepository.create.mockResolvedValue(newUser);

            const result = await authService.signup({
                name: newUser.name,
                email: newUser.email,
                password: newUser.password,
                role: newUser.role,
            });

            expect(result).toEqual({
                user: {
                    id: 1,
                    uuid: newUser.uuid,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                },
                token: 'mocked-token',
                expiresIn: 3600,
            });

            expect(userRepository.create).toHaveBeenCalledWith({
                name: newUser.name,
                email: newUser.email,
                password: newUser.password,
                role: newUser.role,
            });
        });
    });
});