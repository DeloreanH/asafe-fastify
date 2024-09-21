import { Static, Type } from '@sinclair/typebox';

export const apiErrorResponseSchema = Type.Object(
  {
    statusCode: Type.Number({ example: 400 }),
    message: Type.String({ example: 'Validation Error' }),
    error: Type.String({ example: 'Bad Request' }),
    subErrors: Type.Optional(
      Type.String({
        description: 'Optional list of sub-errors',
        example: 'incorrect email',
      }),
    ),
  },
  { $id: 'ApiErrorResponse' },
);

export type ApiErrorResponse = Static<typeof apiErrorResponseSchema>;
