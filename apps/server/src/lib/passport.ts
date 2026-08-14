import { Strategy as jwtStrategy, type VerifiedCallback } from 'passport-jwt';
import passport from 'passport';
import type { Request } from '../types/express.ts';
import type { Algorithm } from 'jsonwebtoken';
import { AppError } from '../utils/customError.js';
import type { UserService } from '../services/user.service.js';

export type JwtPayload = {
  sub: number;
  iat: number;
  exp: number;
};

type Passport = passport.PassportStatic;

const secret = process.env.SECRET_JWT;

if (!secret) {
  throw new AppError(500, 'Environment SECRET_JWT is not set');
}

function getAuthCookie(req: Request) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['authToken'];
  }
  return token;
}

const jwtOptions = {
  jwtFromRequest: getAuthCookie,
  secretOrKey: secret,
  algorithms: ['HS256'] as Algorithm[],
};

export default function configurePassport(passport: Passport, userService: UserService) {
  passport.use(
    new jwtStrategy(jwtOptions, async (payload: JwtPayload, done: VerifiedCallback) => {
      try {
        const user = await userService.findById(payload.sub);

        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }),
  );
}
