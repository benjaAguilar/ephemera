import z from 'zod';

export const CurrentUserSchema = z.object({
  id: z.number(),
  username: z.string(),
  expiresIn: z.date(),
});

export type CurrentUserType = z.infer<typeof CurrentUserSchema>;
