import { describe, it, expect } from 'vitest';
import { calcExpiration, validateData } from '../../src/utils/utils.js';
import { RegisterSchema } from '@ephemera/schemas';
import { ValidationError } from '../../src/utils/customError.js';

describe('utils.ts', () => {
  describe('validateData()', () => {
    it('should return parsed data if data is valid', () => {
      const data = validateData(RegisterSchema, { username: 'jorge', ttl: '1h' });

      expect(data).toEqual({
        username: 'jorge',
        ttl: '1h',
      });
    });

    it('should return ValidationError if data is invalid', () => {
      expect(() => validateData(RegisterSchema, { username: 'jo', ttl: '900h' })).toThrow(
        ValidationError,
      );
    });

    it('should return ValidationError if data is missing', () => {
      expect(() => validateData(RegisterSchema, {})).toThrow(ValidationError);
    });
  });

  describe('calcExpiration()', () => {
    it('should return date in MS format', () => {
      const ONE_DAY_MS = 86400000;
      const expiresIn = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const expiresInMS = calcExpiration(expiresIn);

      expect(expiresInMS).toBeTypeOf('number');
      expect(ONE_DAY_MS).toEqual(expiresInMS);
    });
  });
});
