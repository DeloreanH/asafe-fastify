import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { ConflictException } from '../../shared/exceptions';
import { createContainer, asValue, asClass, InjectionMode } from 'awilix';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';

// Mock bcrypt
jest.mock('bcrypt', () => ({
    hash: jest.fn(),
}));

describe('UserService', () => {
    let userService: UserService;
    let userRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        jest.clearAllMocks();

        userRepository = {
            findByEmail: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        } as unknown as jest.Mocked<UserRepository>;

        const container = createContainer({
            injectionMode: InjectionMode.CLASSIC,
        });

        container.register({
            userRepository: asValue(userRepository),
            userService: asClass(UserService),
        });

        userService = container.resolve<UserService>('userService');
    });
    
    describe('findAll', () => {
        it('should return all users', async () => {
            const mockUsers: User[] = [{ id: 1, email: 'john@doe.com', password: 'hashed_password' } as User];
            userRepository.findAll.mockResolvedValue(mockUsers);

            const result = await userService.findAll();

            expect(result).toEqual(mockUsers);
            expect(userRepository.findAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('findById', () => {
        it('should return a user by id', async () => {
            const mockUser: User = { id: 1, email: 'john@doe.com', password: 'hashed_password' } as User;
            userRepository.findById.mockResolvedValue(mockUser);

            const result = await userService.findById(1);

            expect(result).toEqual(mockUser);
            expect(userRepository.findById).toHaveBeenCalledWith(1);
        });

        it('should return null if user not found', async () => {
            userRepository.findById.mockResolvedValue(null);

            const result = await userService.findById(1);

            expect(result).toBeNull();
            expect(userRepository.findById).toHaveBeenCalledWith(1);
        });
    });

    describe('create', () => {
        it('should create a new user', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@doe.com',
                password: 'password'
            };
            const hashedPassword = 'hashed_password';

            (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
            userRepository.findByEmail.mockResolvedValue(null);
            userRepository.create.mockResolvedValue({ id: 1, ...userData, password: hashedPassword } as User);

            const result = await userService.create(userData);

            expect(result).toEqual({ id: 1, ...userData, password: hashedPassword });
            expect(userRepository.findByEmail).toHaveBeenCalledWith(userData.email);
            expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
            expect(userRepository.create).toHaveBeenCalledWith({ ...userData, password: hashedPassword });
        });

        it('should throw a ConflictException if email already exists', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@doe.com',
                password: 'password'
            };
            userRepository.findByEmail.mockResolvedValue({ id: 1, email: userData.email } as User);

            await expect(userService.create(userData)).rejects.toThrow(ConflictException);
            expect(userRepository.findByEmail).toHaveBeenCalledWith(userData.email);
            expect(bcrypt.hash).not.toHaveBeenCalled();
            expect(userRepository.create).not.toHaveBeenCalled();
        });
    });

    describe('update', () => {
        it('should update a user', async () => {
            const userData = { name: 'new name' };
            userRepository.update.mockResolvedValue({ id: 1, ...userData } as User);

            const result = await userService.update(1, userData);

            expect(result).toEqual({ id: 1, ...userData });
            expect(userRepository.update).toHaveBeenCalledWith(1, userData);
        });
    });

    describe('delete', () => {
        it('should delete a user', async () => {
            const userToDelete: User = { id: 1, email: 'test@example.com', password: 'hashed_password' } as User;
            userRepository.delete.mockResolvedValue(userToDelete);

            const result = await userService.delete(1);

            expect(result).toEqual(userToDelete);
            expect(userRepository.delete).toHaveBeenCalledWith(1);
        });
    });
});
