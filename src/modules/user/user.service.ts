import { User } from '@prisma/client';
import { UserRepository } from './user.repository';
import { CreateUserBody } from './schemas/user-create.schema';
import { ConflictException } from '../../shared/exceptions';
import { UpdateUserBody } from './schemas/user-update.schema';
import { FileUploadService } from '../file-upload/file-upload.service';
import bcrypt from 'bcrypt';

export class UserService {
  constructor(private userRepository: UserRepository, private fileUploadService: FileUploadService) { }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findByUid(uuid: string): Promise<User | null> {
    return this.userRepository.findByUid(uuid);
  }

  async create(data: CreateUserBody): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userData = {
      ...data,
      password: hashedPassword,
    };

    return this.userRepository.create(userData);
  }

  async update(uuid: string, data: UpdateUserBody): Promise<User> {
    return this.userRepository.update(uuid, data);
  }

  async delete(uuid: string): Promise<User> {
    return this.userRepository.delete(uuid);
  }

  async updateAvatar(uuid: string, file: any) {
    const fileUrl = await this.fileUploadService.uploadFile(file, uuid);
    return await this.userRepository.update(uuid, { avatar: fileUrl });
  }
}