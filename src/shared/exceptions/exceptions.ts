import { ExceptionBase } from './exception-base';

/**
 * @class BadRequestException
 * @extends {ExceptionBase}
 */
export class BadRequestException extends ExceptionBase {
  static readonly message = 'Bad Request';
  readonly statusCode = 400;
  readonly error = 'Bad Request';

  constructor(message = BadRequestException.message) {
    super(message);
  }
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
 * @class UnauthorizedException
 * @extends {ExceptionBase}
 */
export class UnauthorizedException extends ExceptionBase {
  static readonly message = 'Unauthorized';
  readonly error = 'Unauthorized';
  readonly statusCode = 401;

  constructor(message = UnauthorizedException.message) {
    super(message);
  }
}

/**
 * @class ForbiddenException
 * @extends {ExceptionBase}
 */
export class ForbiddenException extends ExceptionBase {
  static readonly message = 'Forbidden';
  readonly error = 'Forbidden';
  readonly statusCode = 403;

  constructor(message = ForbiddenException.message) {
    super(message);
  }
}

/**
 * @class ConflictException
 * @extends {ExceptionBase}
 */
export class ConflictException extends ExceptionBase {
  static readonly message = 'Unauthorized';
  readonly error = 'Unauthorized';
  readonly statusCode = 409;

  constructor(message = ConflictException.message) {
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
  readonly statusCode = 500;

  constructor(message = InternalServerErrorException.message) {
    super(message);
  }
}