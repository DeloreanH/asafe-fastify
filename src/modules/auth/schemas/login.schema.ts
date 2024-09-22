import { Static, Type } from '@sinclair/typebox';

export const LoginBodySchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String()
});

export type LoginBody = Static<typeof LoginBodySchema>;

export const LoginResponseSchema = Type.Object({
  token: Type.String(),
  expiresIn: Type.Number(),
});

export type LoginResponse = Static<typeof LoginResponseSchema>;