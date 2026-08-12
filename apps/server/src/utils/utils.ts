import type { SchemaType } from '@ephemera/schemas';
import { ValidationError } from './customError.js';

export function validateData<T extends SchemaType>(schema: T, data: unknown) {
  const res = schema.safeParse(data);

  if (!res.success) {
    throw new ValidationError('Bad request', [res.error]);
  }

  return res.data;
}
