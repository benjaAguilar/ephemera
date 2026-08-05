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
