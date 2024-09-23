import { Static, Type } from '@sinclair/typebox';

export const uploadAvatarSchema = Type.Object({
  file: Type.Any(),
});

export type uploadAvatar = Static<typeof uploadAvatarSchema>;