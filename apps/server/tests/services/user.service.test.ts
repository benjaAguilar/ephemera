import { describe, it, expect, vi } from 'vitest';
import type { UserRepository } from '../../src/repositories/user.repository.js';
import { createUserService } from '../../src/services/user.service.js';
import { verifyJWT } from '../../src/utils/jwtUtils.js';
import {
  AppError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../../src/utils/customError.js';

vi.mock('../../src/utils/jwtUtils.ts', () => ({
  verifyJWT: vi.fn(),
}));

const prismaUserMock: UserRepository = {
  create: vi.fn(),
  updateExpiration: vi.fn(),
  getById: vi.fn(),
  getByUsername: vi.fn(),
};
const verifyJwtMock = vi.mocked(verifyJWT);
const userService = createUserService(prismaUserMock);

describe('UserService', () => {
  describe('create()', () => {
    it('should create an user', async () => {
      await userService.create('rick');

      expect(prismaUserMock.create).toHaveBeenCalledOnce();
      expect(prismaUserMock.create).toHaveBeenCalledWith('rick');
    });

    it('should throw a ConflictError if username is already taken', async () => {
      const userMock = {
        id: 1,
        username: 'rick',
        createdAt: new Date(),
        expiresIn: null,
      };
      vi.mocked(prismaUserMock.getByUsername).mockResolvedValueOnce(userMock);

      expect(async () => await userService.create('rick')).rejects.toThrow(ConflictError);
      expect(prismaUserMock.create).not.toHaveBeenCalled();
    });
  });

  describe('updateExpiration()', () => {
    it('should update user expiration and return the date', async () => {
      const userMock = {
        id: 3,
        username: 'bart',
        createdAt: new Date(),
        expiresIn: new Date(),
      };
      vi.mocked(prismaUserMock.updateExpiration).mockResolvedValueOnce(userMock);

      const expiration = Math.floor(Date.now() / 1000) + 3600;

      verifyJwtMock.mockReturnValue({
        userId: 3,
        exp: expiration,
        iat: expiration,
      });

      const res = await userService.updateExpiration(3, 'super-token');

      expect(prismaUserMock.updateExpiration).toHaveBeenCalledOnce();
      expect(prismaUserMock.updateExpiration).toHaveBeenCalledWith(3, new Date(expiration * 1000));
      expect(res).toBeInstanceOf(Date);
    });

    it('should not update date when token verification fails', () => {
      verifyJwtMock.mockImplementation(() => {
        throw new UnauthorizedError('Invalid or expired token');
      });

      expect(async () => {
        await userService.updateExpiration(3, 'super-invalid-token');
      }).rejects.toThrow(UnauthorizedError);
      expect(prismaUserMock.updateExpiration).not.toHaveBeenCalled();
    });

    it('Should throw an app error if expiresIn update fails', () => {
      const userMock = {
        id: 3,
        username: 'bart',
        createdAt: new Date(),
        expiresIn: null,
      };
      vi.mocked(prismaUserMock.updateExpiration).mockResolvedValueOnce(userMock);

      expect(async () => {
        await userService.updateExpiration(3, 'super-valid-token');
      }).rejects.toThrow(AppError);
    });
  });

  describe('findById()', () => {
    it('Should call prisma with expected parameters and return the user', async () => {
      const userMock = {
        id: 4,
        username: 'lisa',
        createdAt: new Date(),
        expiresIn: null,
      };

      vi.mocked(prismaUserMock.getById).mockResolvedValueOnce(userMock);
      const user = await userService.findById(4);

      expect(prismaUserMock.getById).toHaveBeenCalledWith(4);
      expect(user).toEqual(userMock);
    });

    it('should return null if prisma returns null', async () => {
      const userMock = null;
      vi.mocked(prismaUserMock.getById).mockResolvedValueOnce(userMock);

      const user = await userService.findById(4);

      expect(prismaUserMock.getById).toHaveBeenCalledWith(4);
      expect(user).toEqual(userMock);
    });
  });

  describe('getById()', () => {
    it('Should call prisma with expected parameters and return the user', async () => {
      const userMock = {
        id: 4,
        username: 'lisa',
        createdAt: new Date(),
        expiresIn: null,
      };

      vi.mocked(prismaUserMock.getById).mockResolvedValueOnce(userMock);
      const user = await userService.getById(4);

      expect(prismaUserMock.getById).toHaveBeenCalledWith(4);
      expect(user).toEqual(userMock);
    });

    it('should throw notFoundError if prisma returns null', async () => {
      const userMock = null;
      vi.mocked(prismaUserMock.getById).mockResolvedValueOnce(userMock);

      expect(async () => await userService.getById(4)).rejects.toThrow(NotFoundError);
      expect(prismaUserMock.getById).toHaveBeenCalledWith(4);
    });
  });

  describe('getByUsername()', () => {
    it('Should call prisma with expected parameters and return the user', async () => {
      const userMock = {
        id: 4,
        username: 'lisa',
        createdAt: new Date(),
        expiresIn: null,
      };

      vi.mocked(prismaUserMock.getByUsername).mockResolvedValueOnce(userMock);
      const user = await userService.getByUsername('lisa');

      expect(prismaUserMock.getByUsername).toHaveBeenCalledWith('lisa');
      expect(user).toEqual(userMock);
    });

    it('should throw notFoundError if prisma returns null', async () => {
      const userMock = null;
      vi.mocked(prismaUserMock.getByUsername).mockResolvedValueOnce(userMock);

      expect(async () => await userService.getByUsername('inexistent-user')).rejects.toThrow(
        NotFoundError,
      );
      expect(prismaUserMock.getByUsername).toHaveBeenCalledWith('inexistent-user');
    });
  });
});
