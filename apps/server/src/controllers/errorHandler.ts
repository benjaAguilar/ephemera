import type { Request, Response, Next, Error } from '../types/express.ts';
import { AppError } from '../utils/customError.js';

export function errorHandler(err: Error, _req: Request, res: Response, _next: Next) {
  if (err instanceof AppError) {
    console.log(err.message);

    res.status(err.statusCode).json({
      message: err.expose ? err.message : 'Internal server error',
      details: err.details,
    });
  }

  console.log(err);
  return res.status(500).json({
    message: 'Internal Server Error',
  });
}
