import { Static, Type } from '@sinclair/typebox';

export const createPostBodySchema = Type.Object({
  text: Type.String({ minLength: 10, maxLength: 255 }),
});

export type CreatePostBody = Static<typeof createPostBodySchema>;

export const CreatePostResponseSchema = Type.Object({
  id: Type.Number(),
  uuid: Type.String(),
  text: Type.String(),
  authorUid: Type.String(),
});

export type CreatePostResponse = Static<typeof createPostBodySchema>;
