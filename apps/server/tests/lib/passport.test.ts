import { describe, it, expect, vi } from 'vitest';
import type { UserService } from '../../src/services/user.service.js';
import configurePassport, { createVerifyJWT } from '../../src/lib/passport.js';
import passport from 'passport';
import { Strategy as jwtStrategy, type VerifiedCallback } from 'passport-jwt';
import { AppError } from '../../src/utils/customError.js';

const userServiceMock: UserService = {
  create: vi.fn(),
  updateExpiration: vi.fn(),
  findById: vi.fn(),
  getById: vi.fn(),
  getByUsername: vi.fn(),
};
const doneMock: VerifiedCallback = vi.fn();

describe('passport lib test', () => {
  describe('configurePassport()', () => {
    it('should register the JWT strategy', () => {
      const spy = vi.spyOn(passport, 'use');

      configurePassport(passport, userServiceMock);

      expect(spy).toHaveBeenCalled();

      const strategy = spy.mock.calls[0]![0];
      expect(strategy).toBeInstanceOf(jwtStrategy);

      spy.mockRestore();
    });
  });

  describe('createVerifyJWT()', () => {
    it('Should call done(null, user) if user is found', async () => {
      const userMock = {
        id: 1,
        username: 'rick',
        expiresIn: new Date(),
        createdAt: new Date(),
      };
      vi.mocked(userServiceMock.findById).mockResolvedValueOnce(userMock);

      await createVerifyJWT(userServiceMock)({ sub: 1, iat: 10, exp: 10 }, doneMock);

      expect(userServiceMock.findById).toHaveBeenCalledWith(1);
      expect(doneMock).toHaveBeenCalledWith(null, userMock);
    });

    it('Should call done(null, false) if user is not found', async () => {
      const userMock = null;
      vi.mocked(userServiceMock.findById).mockResolvedValueOnce(userMock);

      await createVerifyJWT(userServiceMock)({ sub: 1, iat: 10, exp: 10 }, doneMock);

      expect(userServiceMock.findById).toHaveBeenCalledWith(1);
      expect(doneMock).toHaveBeenCalledWith(null, false);
    });

    it('Should call done(err, false) if service fails', async () => {
      const err = new AppError(500, 'err');
      vi.mocked(userServiceMock.findById).mockRejectedValueOnce(err);

      await createVerifyJWT(userServiceMock)({ sub: 1, iat: 10, exp: 10 }, doneMock);

      expect(doneMock).toHaveBeenCalledWith(err, false);
    });
  });
});
