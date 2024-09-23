import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { ConflictException } from '../../shared/exceptions';
import { createContainer, asValue, asClass, InjectionMode } from 'awilix';
import { FileUploadService } from '../file-upload/file-upload.service';
import { User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { MultipartFile } from '@fastify/multipart';
import { Role as PrismaRole } from '@prisma/client';

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
}));

describe('UserService', () => {
    let userService: UserService;
    let userRepository: jest.Mocked<UserRepository>;
    let fileUploadService: jest.Mocked<FileUploadService>;

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

        fileUploadService = {
            uploadFile: jest.fn(),
        } as unknown as jest.Mocked<FileUploadService>;

        const container = createContainer({
            injectionMode: InjectionMode.CLASSIC,
        });

        container.register({
            userRepository: asValue(userRepository),
            fileUploadService: asValue(fileUploadService),
            userService: asClass(UserService),
        });

        userService = container.resolve<UserService>('userService');
    });

    describe('findAll', () => {
        it('should return all users', async () => {
            const mockUsers = [{
                id: 1,
                uuid: uuidv4(),
                email: "john@doe.com",
                name: "john doe",
                password: 'hashed_password',
                role: PrismaRole.BASIC,
                avatar: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            }];

            userRepository.findAll.mockResolvedValue(mockUsers);

            const result = await userService.findAll();

            expect(result).toEqual(mockUsers);
            expect(userRepository.findAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('findById', () => {
        it('should return a user by uuid', async () => {
            const uuid = uuidv4()
            const mockUser = {
                id: 1,
                uuid,
                email: "john@doe.com",
                name: "john doe",
                password: 'hashed_password',
                role: PrismaRole.BASIC,
                avatar: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
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
            const uuid = uuidv4();
            const userData = {
                name: 'John Doe',
                email: 'john@doe.com',
                password: 'password',
                role: PrismaRole.BASIC,
            };

            const hashedPassword = 'hashed_password';

            const createdMock = {
                ...userData,
                id: 1,
                uuid,
                pasword: hashedPassword,
                avatar: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
            userRepository.findByEmail.mockResolvedValue(null);
            userRepository.create.mockResolvedValue(createdMock);

            const result = await userService.create(userData);

            expect(result).toEqual(createdMock);
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

            const updatedMock = {
                ...userData,
                id: 1,
                uuid,
                email: "john@doe.com",
                password: 'hashed_password',
                role: PrismaRole.BASIC,
                avatar: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            userRepository.update.mockResolvedValue(updatedMock);

            const result = await userService.update(uuid, userData);

            expect(result).toEqual(updatedMock);
            expect(userRepository.update).toHaveBeenCalledWith(uuid, userData);
        });
    });

    describe('delete', () => {
        it('should delete a user', async () => {
            const uuid = uuidv4();
            const deletedMock = {
                id: 1,
                uuid,
                name: "deleted joe",
                email: "john@doe.com",
                password: 'hashed_password',
                role: PrismaRole.BASIC,
                avatar: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            userRepository.delete.mockResolvedValue(deletedMock);
            const result = await userService.delete(uuid);
            expect(result).toEqual(deletedMock);
            expect(userRepository.delete).toHaveBeenCalledWith(uuid);
        });
    });
    
    describe('updateAvatar', () => {
        it('should update the user avatar and return updated user', async () => {
            const uuid = uuidv4();
            const mockFile = {
                filename: 'avatar.png',
                mimetype: 'image/png',
                createReadStream: jest.fn().mockReturnValue({
                    pipe: jest.fn(),
                }),
            } as unknown as MultipartFile;

            const fileUrl = 'https://storage.googleapis.com/bucket/avatar.png';

            const updatedMock = {
                id: 1,
                uuid,
                email: "john@doe.com",
                name: "john doe",
                password: 'hashed_password',
                role: PrismaRole.BASIC,
                avatar: fileUrl,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            fileUploadService.uploadFile.mockResolvedValue(fileUrl);
            userRepository.update.mockResolvedValue(updatedMock);

            const result = await userService.updateAvatar(uuid, mockFile);

            expect(result).toEqual(updatedMock);
            expect(fileUploadService.uploadFile).toHaveBeenCalledWith(mockFile, uuid);
            expect(userRepository.update).toHaveBeenCalledWith(uuid, { avatar: fileUrl });
        });

        it('should throw an error if file upload fails', async () => {
            const uuid = uuidv4();
            const mockFile = {
                filename: 'avatar.png',
                mimetype: 'image/png',
                createReadStream: jest.fn().mockReturnValue({
                    pipe: jest.fn(), // Mocking the pipe method
                }),
            } as unknown as MultipartFile;

            const uploadError = new Error('Upload failed');
            fileUploadService.uploadFile.mockRejectedValue(uploadError);

            await expect(userService.updateAvatar(uuid, mockFile)).rejects.toThrow('Upload failed');
            expect(fileUploadService.uploadFile).toHaveBeenCalledWith(mockFile, uuid);
            expect(userRepository.update).not.toHaveBeenCalled();
        });
    });
});
