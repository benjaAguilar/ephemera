import { describe, it, expect } from 'vitest';
import { ZodError } from 'zod';
import { CurrentUserSchema } from '../../src';

const VALID = {
  id: 1,
  username: 'luca_ceruti',
  expiresIn: new Date(),
};

const INVALID = {
  id: '3',
  username: 'luca ceruti',
  expiresIn: '30m',
};

describe('CurrentUser Schema', () => {
  it('Should pass if the data is valid', () => {
    const res = CurrentUserSchema.safeParse(VALID);

    expect(res.success).toBe(true);
    expect(res.error).not.toBeDefined();
    expect(res.data).toEqual(VALID);
  });

  it('Should fail if the data is invalid', () => {
    const res = CurrentUserSchema.safeParse(INVALID);

    expect(res.success).toBe(false);
    expect(res.error).toBeInstanceOf(ZodError);
  });
});
