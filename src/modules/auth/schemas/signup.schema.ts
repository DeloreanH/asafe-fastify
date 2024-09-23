import { Static, Type } from '@sinclair/typebox';
import { Role as PrismaRole } from '@prisma/client';

export const signUpBodySchema = Type.Object({
  name: Type.String(),
  email: Type.String({ format: 'email' }),
  password: Type.String(),
  role: Type.Optional(Type.Enum(PrismaRole)),
});

export type signUpBody = Static<typeof signUpBodySchema>;

export const signUpResponseSchema = Type.Object({
  user: Type.Object({
    id: Type.Number(),
    uuid: Type.String(),
    name: Type.String(),
    email: Type.String(),
    role: Type.String()
  }),
  token: Type.String(),
  expiresIn: Type.Number(),
});

export type signUpResponse = Static<typeof signUpResponseSchema>;