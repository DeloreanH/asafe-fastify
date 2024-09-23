import { Static, Type } from '@sinclair/typebox';

export const findAllUserSchema = Type.Array(
  Type.Object({
    id: Type.Number(),
    name: Type.String(),
    email: Type.String(),
    role: Type.String(),
  })
);

export type findAllUserResponse = Static<typeof findAllUserSchema>;