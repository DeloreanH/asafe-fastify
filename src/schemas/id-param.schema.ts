import { Type } from "@sinclair/typebox";

export const idParamsSchema = Type.Object({
  id: Type.Number(),
});
