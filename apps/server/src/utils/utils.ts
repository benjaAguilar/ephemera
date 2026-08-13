import type { SchemaType } from '@ephemera/schemas';
import { AppError, ValidationError } from './customError.js';

export function validateData<T extends SchemaType>(schema: T, data: unknown) {
  const res = schema.safeParse(data);

  if (!res.success) {
    throw new ValidationError('Bad request', [res.error]);
  }

  return res.data;
}

export function calcExpiration(expiresIn: Date | null): number {
  if (!expiresIn) {
    throw new AppError(500, 'Error setting expiresIn Date');
  }

  return Math.ceil(expiresIn.getTime() - Date.now());
}
