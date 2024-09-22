import { Static, Type } from '@sinclair/typebox';

export const HealthResponseSchema = Type.Object({
  status: Type.String(),

});

export type HealthResponse = Static<typeof HealthResponseSchema>;