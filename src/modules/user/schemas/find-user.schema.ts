import { Static, Type } from '@sinclair/typebox';

export const findUserSchema = Type.Object({
  id: Type.Number(),
  uuid: Type.String(),
  name: Type.String(),
  email: Type.String(),
  role: Type.String(),
})

export type FindUserResponse = Static<typeof findUserSchema>;