export interface SerializedException {
  message: string;
  error: string;
  statusCode?: number;
  stack?: string;
  cause?: string;
}

export abstract class ExceptionBase extends Error {
  abstract error: string;
  abstract statusCode: number;

  /**
   * @param {string} message
   * @param cause
   */
  constructor(
    readonly message: string,
    readonly cause?: Error,
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
  
}
