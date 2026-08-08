import { describe, it, expect, beforeEach, afterEach, assert } from 'vitest';
import createJWT from '../../src/utils/createJWT.js';
import { AppError } from '../../src/utils/customError.js';
import jsonwebtoken from 'jsonwebtoken';

describe('createJWT Function Util', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV, SECRET_JWT: 'super-secret-key' };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it('Should return a signed token', () => {
    const signedToken = createJWT(4, '30m');
    expect(signedToken).toBeDefined();
    expect(signedToken).toBeTypeOf('string');
  });

  it('Should generate a valid token with sub and correct expiracy', () => {
    const signedToken = createJWT(67, '15m');
    const decoded = jsonwebtoken.verify(signedToken, 'super-secret-key');

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
