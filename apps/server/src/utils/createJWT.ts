import jsonwebtoken from 'jsonwebtoken';
import { AppError } from './customError.js';
import type { RegisterType } from '@ephemera/schemas';

type ExpiresEnum = RegisterType['ttl'];

export default function createJWT(userId: number, expiresIn: ExpiresEnum) {
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
