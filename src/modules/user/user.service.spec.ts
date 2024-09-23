import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { ConflictException } from '../../shared/exceptions';
import { createContainer, asValue, asClass, InjectionMode } from 'awilix';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';

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
            findByUid: jest.fn(),
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
            const mockUsers: User[] = [{ id: 1, uuid: uuidv4(), email: 'john@doe.com', password: 'hashed_password' } as User];
            userRepository.findAll.mockResolvedValue(mockUsers);

            const result = await userService.findAll();

            expect(result).toEqual(mockUsers);
            expect(userRepository.findAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('findById', () => {
        it('should return a user by uuid', async () => {
            const uuid = uuidv4();
            const mockUser: User = { id: 1, uuid: uuid, email: 'john@doe.com', password: 'hashed_password' } as User;
            userRepository.findByUid.mockResolvedValue(mockUser);

            const result = await userService.findByUid(uuid);

            expect(result).toEqual(mockUser);
            expect(userRepository.findByUid).toHaveBeenCalledWith(uuid);
        });

        it('should return null if user not found', async () => {
            const uuid = uuidv4();
            userRepository.findByUid.mockResolvedValue(null);

            const result = await userService.findByUid(uuid);

            expect(result).toBeNull();
            expect(userRepository.findByUid).toHaveBeenCalledWith(uuid);
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
            const uuid = uuidv4();
            (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
            userRepository.findByEmail.mockResolvedValue(null);
            userRepository.create.mockResolvedValue({ id: 1, uuid, ...userData, password: hashedPassword } as User);

            const result = await userService.create(userData);

            expect(result).toEqual({ id: 1, uuid, ...userData, password: hashedPassword });
            expect(userRepository.findByEmail).toHaveBeenCalledWith(userData.email);
            expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
            expect(userRepository.create).toHaveBeenCalledWith({ ...userData, password: hashedPassword });
        });

        it('should throw a ConflictException if email already exists', async () => {
            const uuid = uuidv4();
            const userData = {
                name: 'John Doe',
                email: 'john@doe.com',
                password: 'password'
            };
            userRepository.findByEmail.mockResolvedValue({ id: 1, uuid, email: userData.email } as User);

            await expect(userService.create(userData)).rejects.toThrow(ConflictException);
            expect(userRepository.findByEmail).toHaveBeenCalledWith(userData.email);
            expect(bcrypt.hash).not.toHaveBeenCalled();
            expect(userRepository.create).not.toHaveBeenCalled();
        });
    });

    describe('update', () => {
        it('should update a user', async () => {
            const uuid = uuidv4();
            const userData = { name: 'new name' };
            userRepository.update.mockResolvedValue({ id: 1, uuid, ...userData } as User);

            const result = await userService.update(uuid, userData);

            expect(result).toEqual({ id: 1, uuid, ...userData });
            expect(userRepository.update).toHaveBeenCalledWith(uuid, userData);
        });
    });

    describe('delete', () => {
        it('should delete a user', async () => {
            const uuid = uuidv4();
            const userToDelete: User = { id: 1, uuid, email: 'test@example.com', password: 'hashed_password' } as User;
            userRepository.delete.mockResolvedValue(userToDelete);

            const result = await userService.delete(uuid);

            expect(result).toEqual(userToDelete);
            expect(userRepository.delete).toHaveBeenCalledWith(uuid);
        });
    });
});
