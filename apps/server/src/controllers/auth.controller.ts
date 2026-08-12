import { RegisterSchema } from '@ephemera/schemas';
import type { UserService } from '../services/user.service.js';
import type { Request, Response } from '../types/express.js';
import { ValidationError } from '../utils/customError.js';
import { createJWT } from '../utils/jwtUtils.js';

interface AuthController {
  auth(req: Request, res: Response): Promise<void>;
}

export function createAuthController(userService: UserService): AuthController {
  return {
    async auth(req, res) {
      const { username, ttl } = req.body;

      //TODO: refactor in a validation util (see #104)
      const data = RegisterSchema.safeParse({ username, ttl });
      if (!data.success) {
        throw new ValidationError('Bad request', [data.error]);
      }

      const user = await userService.create(data.data.username);

      const token = createJWT(user.id, data.data.ttl);
      const { expiresIn } = await userService.updateExpiration(user.id, token);

      //TODO: refactor: in a clacExpiration util (see #105)
      if (!expiresIn) {
        throw new ValidationError('Bad request');
      }

      const expirationInMs = Math.ceil(expiresIn.getTime() - Date.now());

      res
        .status(200)
        .cookie('authToken', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: expirationInMs,
        })
        .json({
          message: 'User Created and authenticated',
        });
    },
  };
}
