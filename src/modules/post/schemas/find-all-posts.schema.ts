import { Static, Type } from '@sinclair/typebox';

export const findAllPostsSchema = Type.Array(
  Type.Object({
    id: Type.Number(),
    uuid: Type.String(),
    text: Type.String(),
    authorId: Type.Number(),
  })
);

export type FindAllPostsResponse = Static<typeof findAllPostsSchema>;