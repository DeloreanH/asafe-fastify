import { Static, Type } from '@sinclair/typebox';

export const postFindSchema = Type.Object({
  id: Type.Number(),
  uuid: Type.String(),
  text: Type.String(),
  authorUid: Type.String(),
});

export type FindPostResponse = Static<typeof postFindSchema>;
