import { z, type ZodError } from 'zod';

export function formatErr<T>(err: ZodError<T>) {
  return z.flattenError(err);
}
