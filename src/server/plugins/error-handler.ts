import { ExceptionBase } from '../../shared/exceptions';
import { ApiErrorResponse, apiErrorResponseSchema } from '../../shared/api';
import { FastifyError, FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

const fastifyErrorCodesMap = {
  FST_ERR_VALIDATION: (error: FastifyError) => ({
    subErrors: (error.validation ?? []).map((validationError) => ({
      path: validationError.instancePath,
      message: validationError.message ?? '',
    })),
    statusCode: 400,
    message: 'Validation error',
    error: 'Bad Request',
  }),
  FST_ERR_NOT_FOUND: () => ({
    message: 'Not Found',
    error: 'Not Found',
    statusCode: 404,
  }),
};

type FastifyErrorCodes = keyof typeof fastifyErrorCodesMap;

async function errorHandlerPlugin(fastify: FastifyInstance) {
  fastify.setErrorHandler((error: FastifyError | Error, request, reply) => {
    // Handle Fastify errors
    if ('code' in error && error.code in fastifyErrorCodesMap) {
      const fastifyError = fastifyErrorCodesMap[error.code as FastifyErrorCodes];

      if (fastifyError) {
        const response = fastifyError(error as FastifyError);
        return reply.status(response.statusCode).send(response);
      }
    }

    // Check for custom exceptions extending ExceptionBase
    if (error instanceof ExceptionBase) {
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        message: error.message,
        error: error.error,
      } satisfies ApiErrorResponse);
    }

    // Catch-all for unknown errors
    fastify.log.error(error);
    return reply.status(500).send({
      statusCode: 500,
      message: error?.message || 'Internal Server Error',
      error: 'Internal Server Error',
    } satisfies ApiErrorResponse);
  });

  // Add the ApiErrorResponse schema to the fastify instance
  fastify.addSchema(apiErrorResponseSchema);
}

// Export the plugin
export default fp(errorHandlerPlugin, {
  name: 'errorHandler',
});