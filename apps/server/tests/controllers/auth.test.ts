import { describe, it, expect, vi } from 'vitest';
import { type UserService } from '../../src/services/user.service.js';
import { createAuthController } from '../../src/controllers/auth.controller.js';
import type { Request, Response } from '../../src/types/express.js';
import { createJWT } from '../../src/utils/jwtUtils.js';
import { calcExpiration, validateData } from '../../src/utils/utils.js';
import { RegisterSchema } from '@ephemera/schemas';

const ONE_DAY = 24 * 60 * 60 * 1000;

vi.mock('../../src/utils/jwtUtils.ts', () => ({
  createJWT: vi.fn().mockReturnValue('super-token'),
}));
vi.mock('../../src/utils/utils.ts', () => ({
  calcExpiration: vi.fn().mockReturnValue(86400000),
  validateData: vi.fn().mockReturnValue({ username: 'rick', ttl: '1d' }),
}));

const createJwtMock = vi.mocked(createJWT);
const validateDataMock = vi.mocked(validateData);
const calcExpirationMock = vi.mocked(calcExpiration);

const userServiceMock: UserService = {
  create: vi.fn().mockReturnValue({ id: 3 }),
  updateExpiration: vi.fn().mockImplementation(() => new Date(Date.now() + ONE_DAY)),
  getById: vi.fn(),
  getByUsername: vi.fn(),
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

    it('Should call validateData with expected data', async () => {
      await authController.auth(req, res);

      expect(validateDataMock).toHaveBeenCalledWith(RegisterSchema, {
        username: 'rick',
        ttl: '1d',
      });
    });

    it('should call UserService.create() with validated data', async () => {
      await authController.auth(req, res);

      expect(userServiceMock.create).toHaveBeenCalledWith('rick');
    });

    it('Should call createJWT with expected data', async () => {
      await authController.auth(req, res);

      expect(createJwtMock).toHaveBeenCalledWith(3, '1d');
    });

    it('should call UserService.updateExpiration() with expected data', async () => {
      await authController.auth(req, res);

      expect(userServiceMock.updateExpiration).toHaveBeenCalledWith(3, 'super-token');
    });

    it('Should call calcExpiration with expected date', async () => {
      vi.useFakeTimers();

      const now = new Date('2026-08-12T12:00:00.000Z');
      vi.setSystemTime(now);

      await authController.auth(req, res);

      expect(calcExpirationMock).toHaveBeenCalledWith(new Date(Date.now() + ONE_DAY));

      vi.useRealTimers();
    });
  });
});
