import { describe, it, expect } from 'vitest';
import { hello } from '../index.js';

describe('First test suite', () => {
  it('should return string: Hello World', () => {
    const res = hello();
    expect(res).toEqual('Hello World');
  });
});
