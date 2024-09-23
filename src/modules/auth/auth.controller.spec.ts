import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthController } from './auth.controller';
import { Role as PrismaRole } from '@prisma/client';
import { AuthService } from './auth.service';
import { LoginBody } from './schemas/login.schema';
import { signUpBody } from './schemas/signup.schema';
import { asValue, asClass, createContainer, InjectionMode, AwilixContainer } from 'awilix';
import { ConflictException, UnauthorizedException } from '../../shared/exceptions';

describe('AuthController', () => {
    let container: AwilixContainer;
    let authService: jest.Mocked<AuthService>;
    let authController: AuthController;
    let mockReply: FastifyReply;

    beforeEach(() => {
        jest.clearAllMocks();

        authService = {
            login: jest.fn(),
            signup: jest.fn(),
        } as unknown as jest.Mocked<AuthService>;

        container = createContainer({
            injectionMode: InjectionMode.CLASSIC,
        });

        container.register({
            authService: asValue(authService),
            authController: asClass(AuthController),
        });

        authController = container.resolve<AuthController>('authController');

        mockReply = {
            send: jest.fn(),
        } as unknown as FastifyReply;
    });

    describe('login', () => {
        it('should call AuthService login and return token data', async () => {
            const mockRequest = {
                body: {
                    email: 'john@doe',
                    password: 'password123',
                } as LoginBody,
            } as FastifyRequest<{ Body: LoginBody }>;

            const tokenData = {
                token: 'mockToken',
                expiresIn: 3600,
            };

            authService.login.mockResolvedValue(tokenData);

            await authController.login(mockRequest, mockReply);

            expect(authService.login).toHaveBeenCalledWith(mockRequest.body);
            expect(mockReply.send).toHaveBeenCalledWith(tokenData);
        });

        it('should throw an error if login fails', async () => {
            const mockRequest = {
                body: {
                    email: 'john@doe.com',
                    password: 'wrongpassword',
                } as LoginBody,
            } as FastifyRequest<{ Body: LoginBody }>;

            authService.login.mockRejectedValue(new UnauthorizedException());

            await expect(authController.login(mockRequest, mockReply)).rejects.toThrow('Unauthorized');
            expect(authService.login).toHaveBeenCalledWith(mockRequest.body);
        });
    });

    describe('signup', () => {
        it('should call AuthService signup and return signup data', async () => {
            const mockRequest = {
                body: {
                    email: 'john@doe.com',
                    password: 'password123',
                    name: 'John Doe',
                    role: PrismaRole.BASIC,
                } as signUpBody,
            } as FastifyRequest<{ Body: signUpBody }>;

            const signupResponse = {
                user: {
                    id: 1,
                    email: mockRequest.body.email,
                    name: mockRequest.body.name,
                    role: PrismaRole.BASIC,
                },
                token: 'mockToken',
                expiresIn: 3600,
            };

            authService.signup.mockResolvedValue(signupResponse);

            await authController.signup(mockRequest, mockReply);

            expect(authService.signup).toHaveBeenCalledWith(mockRequest.body);
            expect(mockReply.send).toHaveBeenCalledWith(signupResponse);
        });

        it('should throw an error if signup fails', async () => {
            const mockRequest = {
                body: {
                    email: 'john@doe.com',
                    password: 'password123',
                    name: 'John Exist',
                    role: PrismaRole.BASIC,
                } as signUpBody,
            } as FastifyRequest<{ Body: signUpBody }>;


            authService.signup.mockRejectedValue(new ConflictException('User already exists'));

            await expect(authController.signup(mockRequest, mockReply)).rejects.toThrow('User already exists');
            expect(authService.signup).toHaveBeenCalledWith(mockRequest.body);
        });
    });
});