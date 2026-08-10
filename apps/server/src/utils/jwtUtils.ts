import jsonwebtoken, { type JwtPayload } from 'jsonwebtoken';
import { AppError, UnauthorizedError } from './customError.js';
import type { RegisterType } from '@ephemera/schemas';

type ExpiresEnum = RegisterType['ttl'];

export interface JWTpayload extends JwtPayload {
  userId: number;
  exp: number;
  iat: number;
}

export function createJWT(userId: number, expiresIn: ExpiresEnum) {
  const secret = process.env.SECRET_JWT;
  if (!secret) {
    throw new AppError(500, 'ENV var SECRET_JWT is not set', false);
  }

  const signedToken = jsonwebtoken.sign({ sub: userId }, secret, {
    expiresIn,
    algorithm: 'HS256',
  });

  return signedToken;
}

export function verifyJWT(token: string) {
  const secret = process.env.SECRET_JWT;
  if (!secret) {
    throw new AppError(500, 'ENV var SECRET_JWT is not set', false);
  }

  try {
    const decoded = jsonwebtoken.verify(token, secret) as JWTpayload; // justified type assertion since sign always gonna receive an object
    return decoded;
  } catch (err) {
    throw new UnauthorizedError('Invalid or expired session');
  }
}
