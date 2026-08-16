import type { SchemaType } from '@ephemera/schemas';
import { UnauthorizedError, ValidationError } from './customError.js';
import type { User } from '../../prisma/generated/prisma/client.js';
import type { Request } from '../types/express.js';

export function validateData<T extends SchemaType>(schema: T, data: unknown) {
  const res = schema.safeParse(data);

  if (!res.success) {
    throw new ValidationError('Bad request', [res.error]);
  }

  return res.data;
}

export function calcExpiration(expiresIn: Date): number {
  return Math.ceil(expiresIn.getTime() - Date.now());
}

export function getAuthenticatedUser(req: Request): User {
  const user = req.user;

  if (!user) throw new UnauthorizedError('Unauthorized');

  return user;
}
