import { Static, Type } from '@sinclair/typebox';

export const findAllUserSchema = Type.Array(
  Type.Object({
    id: Type.Number(),
    uuid: Type.String(),
    name: Type.String(),
    email: Type.String(),
    role: Type.String(),
  })
);

export type FindAllUserResponse = Static<typeof findAllUserSchema>;