import { describe, it, expect, vi } from 'vitest';
import { type UserService } from '../../src/services/user.service.js';
import { createAuthController } from '../../src/controllers/auth.controller.js';
import type { Request, Response } from '../../src/types/express.js';
import { ValidationError } from '../../src/utils/customError.js';
import { createJWT } from '../../src/utils/jwtUtils.js';

const ONE_DAY = 24 * 60 * 60 * 1000;

vi.mock('../../src/utils/jwtUtils.ts', () => ({
  createJWT: vi.fn().mockReturnValue('super-token'),
}));

const createJwtMock = vi.mocked(createJWT);
const userServiceMock: UserService = {
  create: vi.fn().mockReturnValue({ id: 3 }),
  updateExpiration: vi.fn().mockImplementation(() => ({
    expiresIn: new Date(Date.now() + ONE_DAY),
  })),
};
const authController = createAuthController(userServiceMock);

const req = {
  body: {
    username: 'rick',
    ttl: '1d',
  },
} as Request;

const res = {
  cookie: vi.fn().mockReturnThis(),
  status: vi.fn().mockReturnThis(),
  json: vi.fn().mockReturnThis(),
} as unknown as Response;

describe('Auth Controller', () => {
  describe('auth()', () => {
    it('Should return a status 200 with message and cookie', async () => {
      vi.useFakeTimers();

      const now = new Date('2026-08-12T12:00:00.000Z');
      vi.setSystemTime(now);

      await authController.auth(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User Created and authenticated',
      });

      expect(res.cookie).toHaveBeenCalledWith(
        'authToken',
        'super-token',
        expect.objectContaining({
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 24 * 60 * 60 * 1000,
        }),
      );

      vi.useRealTimers();
    });

    it('Should call createJWT with expected data', async () => {
      await authController.auth(req, res);

      expect(createJwtMock).toHaveBeenCalledWith(3, '1d');
    });

    it('should call UserService.create() with validated data', async () => {
      await authController.auth(req, res);

      expect(userServiceMock.create).toHaveBeenCalledWith('rick');
    });

    it('should call UserService.updateExpiration() with expected data', async () => {
      await authController.auth(req, res);

      expect(userServiceMock.updateExpiration).toHaveBeenCalledWith(3, 'super-token');
    });

    it('should throw bad request if user is or ttl is invalid', async () => {
      req.body.username = 'a';
      req.body.ttl = -1;

      expect(async () => {
        await authController.auth(req, res);
      }).rejects.toThrow(ValidationError);
      expect(userServiceMock.create).not.toHaveBeenCalled();
    });
  });
});
