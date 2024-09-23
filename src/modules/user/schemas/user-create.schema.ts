import { Static, Type } from '@sinclair/typebox';
import { Role as PrismaRole } from '@prisma/client';

export const createUserBodySchema = Type.Object({
  name: Type.String({ minLength: 3, maxLength: 70 }),
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 5, maxLength: 15 }),
  role: Type.Optional(Type.Enum(PrismaRole)),
});

export type CreateUserBody = Static<typeof createUserBodySchema>;

export const CreateUserResponseSchema = Type.Object({
  id: Type.Number(),
  uuid: Type.String(),
  name: Type.String(),
  email: Type.String(),
  role: Type.String()
});

export type CreateUserResponse = Static<typeof createUserBodySchema>;