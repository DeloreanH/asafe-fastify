import { Static, Type } from '@sinclair/typebox';

export const findUserSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  email: Type.String(),
  role: Type.String(),
})

export type findUserResponse = Static<typeof findUserSchema>;