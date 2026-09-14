export class ApiError extends Error {
  public statusCode: number;
  public details: Array<object> | undefined;

  constructor(statusCode: number, message: string, details?: Array<object>) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string, details?: Array<object>) {
    super(401, message, details);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
