import { FastifyRequest } from 'fastify';
import { ConflictException, UnauthorizedException } from '../../shared/exceptions';
import { env } from '../../config';
import { LoginBody, LoginResponse } from './schemas/login.schema';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { signUpBody, signUpResponse } from './schemas/signup.schema';

const users = [
  {
    id: 1,
    name: "harry Perez",
    email: 'harryy1242@gmail.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'regular'
  },
];

export class AuthService {
  async login(payload: LoginBody): Promise<LoginResponse> {
    const { email, password } = payload;
    const user = users.find(u => u.email === email); // TODO: mock replace with user service

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
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name: " john doe" + 1,
      id: users.length + 1,
      email,
      password: hashedPassword,
      role
    };

    users.push(newUser); // TODO: mock replace with user service

    const jwt = this.jwtSign(newUser);

    return {
      user: {
        id: newUser.id,
        role: newUser.role,
        name: newUser.name,
        email: newUser.email
      }, ...jwt
    };
  }

  private jwtSign(user: any) {
    const expiresIn = env.jwt.expiresIn;
    const token = jwt.sign({ id: user.id, role: user.role }, env.jwt.secret, { expiresIn });
    return { token, expiresIn };
  }
}