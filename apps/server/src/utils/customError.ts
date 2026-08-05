export class AppError extends Error {
  public statusCode: number;
  public expose: boolean;
  public details: Array<object> | undefined;

  constructor(
    statusCode: number,
    message: string,
    expose: boolean = false,
    details?: Array<object>,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.expose = expose;
    this.details = details;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, details?: Array<object>) {
    super(404, message, true, details);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Array<object>) {
    super(400, message, true, details);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string, details?: Array<object>) {
    super(401, message, true, details);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string, details?: Array<object>) {
    super(403, message, true, details);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
