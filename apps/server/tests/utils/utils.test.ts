import { describe, it, expect } from 'vitest';
import { validateData } from '../../src/utils/utils.js';
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
});
