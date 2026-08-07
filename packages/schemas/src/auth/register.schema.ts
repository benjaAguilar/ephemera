import z from 'zod';
import { MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH, TTL_OPTIONS } from './constants';

export const RegisterSchema = z.object({
  username: z
    .string()
    .trim()
    .min(MIN_USERNAME_LENGTH, {
      message: `Username must be at least ${MIN_USERNAME_LENGTH} characters`,
    })
    .max(MAX_USERNAME_LENGTH, {
      message: `Username must be at most ${MAX_USERNAME_LENGTH} characters`,
    })
    .toLowerCase()
    .regex(/^[^\s]+$/, { message: 'No spaces are allowed between the name' }),
  ttl: z.enum(TTL_OPTIONS, { message: 'Please select a valid time to live duration' }),
});
