import { describe, it, expect, beforeEach, afterEach, assert } from 'vitest';
import { createJWT, verifyJWT, type JWTpayload } from '../../src/utils/jwtUtils.js';
import { AppError, UnauthorizedError } from '../../src/utils/customError.js';
import jsonwebtoken from 'jsonwebtoken';

describe('JWT Utils', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV, SECRET_JWT: 'super-secret-key' };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  describe('createJWT', () => {
    it('Should return a signed token', () => {
      const signedToken = createJWT(4, '30m');
      expect(signedToken).toBeDefined();
      expect(signedToken).toBeTypeOf('string');
    });

    it('Should generate a valid token with sub and correct expiracy', () => {
      const signedToken = createJWT(67, '15m');
      const decoded = jsonwebtoken.verify(signedToken, 'super-secret-key') as JWTpayload;

      if (typeof decoded === 'string') {
        assert.fail('decoded is string');
      }

      expect(decoded.sub).toEqual(67);

      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();

      expect(decoded.exp - decoded.iat).toEqual(15 * 60);
    });

    it('Should throw an AppError if SECRET_JWT is not defined', () => {
      delete process.env.SECRET_JWT;
      expect(() => createJWT(12, '12h')).toThrow(AppError);
    });
  });

  describe('verifyJWT', () => {
    it('Should return a decoded token', () => {
      const signedToken = createJWT(4, '30m');
      const decoded = verifyJWT(signedToken);

      expect(decoded).toBeDefined();
      expect(decoded.sub).toEqual(4);
      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
    });

    it('Should return the expected expiracy', () => {
      const signedToken = createJWT(4, '30m');
      const decoded = verifyJWT(signedToken);

      expect(decoded.exp - decoded.iat).toEqual(30 * 60);
    });

    it('Should throw an AppError if SECRET_JWT is not defined', () => {
      const signedToken = createJWT(4, '30m');
      delete process.env.SECRET_JWT;
      expect(() => verifyJWT(signedToken)).toThrow(AppError);
    });

    it('Should throw an UnauthorizedError if token is invalid or expired', () => {
      expect(() => verifyJWT('invalid-token')).toThrow(UnauthorizedError);
    });
  });
});
