import * as z from 'zod';

export function hello() {
  return 'Hello World';
}

export const UserTest = z.object({
  username: z.string(),
  age: z.number(),
});
