import { describe, it, expect } from 'vitest';
import { hello, UserTest } from '../index.js';
import { ZodError } from 'zod';

describe('First test suite', () => {
  it('should return string: Hello World', () => {
    const res = hello();
    expect(res).toEqual('Hello World');
  });

  it('should fail if UserTest schema is incorrect', () => {
    const res = UserTest.safeParse({ username: 'rick', age: 'im a pickle' });

    expect(res.success).toBe(false);
    expect(res.error).toBeDefined();
    expect(res.error).toBeInstanceOf(ZodError);
  });

  it('should pass if UserTest schema is correct', () => {
    const res = UserTest.safeParse({ username: 'rick', age: 32 });

    expect(res.success).toBe(true);
    expect(res.error).not.toBeDefined();
    expect(res.data).toEqual({ username: 'rick', age: 32 });
  });
});
