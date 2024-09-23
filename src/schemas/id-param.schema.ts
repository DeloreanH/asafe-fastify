import { Type } from "@sinclair/typebox";

export const idParamsSchema = Type.Object({
  id: Type.Number(),
});

export const uIdParamsSchema = Type.Object({
  uuid: Type.String(),
});

