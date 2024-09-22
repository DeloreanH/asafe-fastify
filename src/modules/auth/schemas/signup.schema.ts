import { Static, Type, Exclude } from '@sinclair/typebox';

export const signUpBodySchema = Type.Object({
  name: Type.String(),
  email: Type.String({ format: 'email' }),
  password: Type.String(),
  role: Type.String(),
});

export type signUpBody = Static<typeof signUpBodySchema>;

export const signUpResponseSchema = Type.Object({
  user: Type.Object({
    name: Type.String(),
    email: Type.String({ format: 'email' }),
    role: Type.String(),
    id: Type.Number(),
  }),
  token: Type.String(),
  expiresIn: Type.Number(),
});

export type signUpResponse = Static<typeof signUpResponseSchema>;