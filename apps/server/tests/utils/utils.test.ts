import { describe, it, expect } from 'vitest';
import { calcExpiration, getAuthenticatedUser, validateData } from '../../src/utils/utils.js';
import { RegisterSchema } from '@ephemera/schemas';
import { UnauthorizedError, ValidationError } from '../../src/utils/customError.js';
import type { Request } from '../../src/types/express.js';

const req = {
  user: {
    id: 3,
    username: 'morty',
  },
} as Request;

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

  describe('getAuthenticatedUser()', () => {
    it('should return the authenticated user if req.user is valid', () => {
      const user = getAuthenticatedUser(req);

      expect(user).toBeDefined();
      expect(user.id).toEqual(3);
      expect(user.username).toEqual('morty');
    });

    it('should throw UnauthorizedError if req.user is undefined', () => {
      req.user = undefined;
      expect(() => getAuthenticatedUser(req)).toThrow(UnauthorizedError);
    });
  });
});
