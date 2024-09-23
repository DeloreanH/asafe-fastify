import { Static, Type } from '@sinclair/typebox';

export const postFindSchema = Type.Object({
  id: Type.Number(),
  uuid: Type.String(),
  text: Type.String(),
  authorId: Type.Number(),
});

export type FindPostResponse = Static<typeof postFindSchema>;
