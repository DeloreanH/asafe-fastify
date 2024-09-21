import { ExceptionBase } from './exception-base';

/**
 * @class BadRequestException
 * @extends {ExceptionBase}
 */
export class BadRequestException extends ExceptionBase {
  readonly statusCode = 400;
  readonly error = 'Bad Request';
}


/**
 * @class NotFoundException
 * @extends {ExceptionBase}
 */
export class NotFoundException extends ExceptionBase {
  static readonly message = 'Not found';
  readonly error = 'Not Found';
  readonly statusCode = 404;

  constructor(message = NotFoundException.message) {
    super(message);
  }
}

/**
 * @class InternalServerErrorException
 * @extends {ExceptionBase}
 */
export class InternalServerErrorException extends ExceptionBase {
  static readonly message = 'Internal server error';
  readonly error = 'Internal server error';
  constructor(message = InternalServerErrorException.message) {
    super(message);
  }

  readonly statusCode = 500;
}