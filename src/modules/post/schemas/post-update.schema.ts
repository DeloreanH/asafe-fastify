import { Static, Type } from '@sinclair/typebox';

export const updatePostBodySchema = Type.Optional(Type.Object({
    text: Type.String({ minLength: 10, maxLength: 255 }),
}));

export type UpdatePostBody = Static<typeof updatePostBodySchema>;

export const updatePostResponseSchema = Type.Object({
    id: Type.Number(),
    uuid: Type.String(),
    text: Type.String(),
    authorUid: Type.String(),
});

export type UpdatePostResponse = Static<typeof updatePostResponseSchema>;
