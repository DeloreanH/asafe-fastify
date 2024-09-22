import { Static, Type } from '@sinclair/typebox';

export const createUserBodySchema = Type.Object({
  name: Type.String({ minLength: 3, maxLength: 255 }),
  email: Type.String({ format: 'email' }),
});

export type CreateUserBody = Static<typeof createUserBodySchema>;

export const CreateUserResponseSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  email: Type.String(),
});

export type CreateUserResponse = Static<typeof createUserBodySchema>;