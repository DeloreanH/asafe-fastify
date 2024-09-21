import {

  ExceptionBase
} from '../../shared/exceptions';
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
    error: 'Bad Request', // https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.1
  }),
  FST_ERR_NOT_FOUND: () => ({
    message: 'Not Found',
    error: 'Not Found',
    statusCode: 404, //  'https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.4',
  }),
};

type FastifyErrorCodes = keyof typeof fastifyErrorCodesMap;

async function errorHandlerPlugin(fastify: FastifyInstance) {
  fastify.setErrorHandler((error: FastifyError | Error, _, res) => {
    // Handle fastify errors
    if ('code' in error && error.code in fastifyErrorCodesMap) {
      const fastifyError = fastifyErrorCodesMap[error.code as FastifyErrorCodes];

      if (fastifyError) {
        const response = fastifyError(error as FastifyError);
        return res.status(response.statusCode).send(response);
      }
    }

    // Catch all other errors
    fastify.log.error(error);
    if (error instanceof ExceptionBase) {
      return res.status(error.statusCode).send({
        statusCode: error.statusCode,
        message: error.message,
        error: error.error,
      } satisfies ApiErrorResponse);
    }

    return res.status(500).send({
      statusCode: 500,
      message: 'Internal Server Error',
      error: 'Internal Server Error',
    } satisfies ApiErrorResponse);
  });

  // Add the ExceptionResponse schema to the fastify instance
  fastify.addSchema(apiErrorResponseSchema);
}

// Export the plugin
export default fp(errorHandlerPlugin, {
  name: 'errorHandler',
});
