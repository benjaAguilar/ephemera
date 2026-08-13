import { RegisterSchema } from '@ephemera/schemas';
import type { UserService } from '../services/user.service.js';
import type { Request, Response } from '../types/express.js';
import { createJWT } from '../utils/jwtUtils.js';
import { calcExpiration, validateData } from '../utils/utils.js';

interface AuthController {
  auth(req: Request, res: Response): Promise<void>;
}

export function createAuthController(userService: UserService): AuthController {
  return {
    async auth(req, res) {
      const { username, ttl } = req.body;
      const data = validateData(RegisterSchema, { username, ttl });

      const user = await userService.create(data.username);

      const token = createJWT(user.id, data.ttl);
      const { expiresIn } = await userService.updateExpiration(user.id, token);

      const expirationInMs = calcExpiration(expiresIn);

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
