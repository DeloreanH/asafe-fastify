import { ConflictException, UnauthorizedException } from '../../shared/exceptions';
import { LoginBody, LoginResponse } from './schemas/login.schema';
import { signUpBody, signUpResponse } from './schemas/signup.schema';
import { UserRepository } from '../user/user.repository';
import { config } from '../../config';
import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export class AuthService {
  constructor(private userRepository: UserRepository) { }

  async login(payload: LoginBody): Promise<LoginResponse> {
    const { email, password } = payload;
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    return this.jwtSign(user);
  }

  async signup(payload: signUpBody): Promise<signUpResponse> {
    const { email, password, role, name } = payload;
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      role
    };

    const createdUser = await this.userRepository.create(newUser);

    const jwt = this.jwtSign(createdUser);

    return {
      user: {
        id: createdUser.id,
        uuid: createdUser.uuid,
        role: createdUser.role,
        name: createdUser.name,
        email: createdUser.email
      },
      ...jwt
    };
  }

  private jwtSign(user: User) {
    const expiresIn = config.jwt.expiresIn;
    const token = jwt.sign({ id: user.id, uuid: user.uuid, role: user.role }, config.jwt.secret, { expiresIn });
    return { token, expiresIn };
  }
}