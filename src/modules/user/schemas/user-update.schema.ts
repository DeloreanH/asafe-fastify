import { Static, Type } from '@sinclair/typebox';
import { Role } from '@prisma/client';


export const updateUserBodySchema = Type.Optional(Type.Object({
    name: Type.Optional(Type.String({ minLength: 3, maxLength: 70 })),
    avatar: Type.Optional(Type.String()),
    role: Type.Optional(Type.Enum(Role)),
}));

export type UpdateUserBody = Static<typeof updateUserBodySchema>;

export const updateUserResponseSchema = Type.Object({
    id: Type.Number(),
    uuid: Type.String(),
    name: Type.String(),
    email: Type.String(),
    role: Type.String(),
    avatar: Type.String(),
});

export type UpdateUserResponse = Static<typeof updateUserResponseSchema>;
