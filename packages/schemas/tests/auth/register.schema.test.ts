import { describe, it, expect } from 'vitest';
import { RegisterSchema } from '../../src/index.js';
import { ZodError } from 'zod';

const VALID = {
  username: 'luca_ceruti',
  ttl: '30m',
};

const INVALID = {
  username: 'luca ceruti',
  ttl: '30m',
};

describe('Register schema', () => {
  it('Should Pass if the given user is valid', () => {
    const result = RegisterSchema.safeParse(VALID);

    expect(result.success).toBe(true);
    expect(result.error).not.toBeDefined();
    expect(result.data).toEqual(VALID);
  });

  it('Special caracters are allowed', () => {
    VALID.username = '$pi-ckle_rick&mort!14#';
    const result = RegisterSchema.safeParse(VALID);

    expect(result.success).toBe(true);
    expect(result.error).not.toBeDefined();
    expect(result.data).toEqual(VALID);
  });

  it('Spaces are not allowed', () => {
    const result = RegisterSchema.safeParse(INVALID);

    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(ZodError);
  });

  it('TTl must be the valid defined enums', () => {
    VALID.ttl = '80d';
    const result = RegisterSchema.safeParse(VALID);

    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(ZodError);
  });

  it('Username length cant be less than 4 characters', () => {
    INVALID.username = 'lis';
    const result = RegisterSchema.safeParse(INVALID);

    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(ZodError);
  });

  it('Username length cant be more than 30 characters', () => {
    INVALID.username = 'who_can_i_have_a_really_long_username_omg';
    const result = RegisterSchema.safeParse(INVALID);

    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(ZodError);
  });
});
