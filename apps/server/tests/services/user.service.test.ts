import { describe, it, expect, vi } from 'vitest';
import type { UserRepository } from '../../src/repositories/user.repository.js';
import { createUserService } from '../../src/services/user.service.js';
import { verifyJWT } from '../../src/utils/jwtUtils.js';
import { NotFoundError, UnauthorizedError } from '../../src/utils/customError.js';

vi.mock('../../src/utils/jwtUtils.ts', () => ({
  verifyJWT: vi.fn(),
}));

const prismaUserMock: UserRepository = {
  create: vi.fn(),
  updateExpiration: vi.fn(),
  getById: vi.fn(),
};
const verifyJwtMock = vi.mocked(verifyJWT);
const userService = createUserService(prismaUserMock);

describe('UserService', () => {
  describe('create()', () => {
    it('should create an user', () => {
      userService.create('rick');

      expect(prismaUserMock.create).toHaveBeenCalledOnce();
      expect(prismaUserMock.create).toHaveBeenCalledWith('rick');
    });
  });

  describe('updateExpiration()', () => {
    it('should update user expiration', () => {
      const expiration = Math.floor(Date.now() / 1000) + 3600;

      verifyJwtMock.mockReturnValue({
        userId: 3,
        exp: expiration,
        iat: expiration,
      });

      userService.updateExpiration(3, 'super-token');

      expect(prismaUserMock.updateExpiration).toHaveBeenCalledOnce();
      expect(prismaUserMock.updateExpiration).toHaveBeenCalledWith(3, new Date(expiration * 1000));
    });

    it('should not create an user when token verification fails', () => {
      verifyJwtMock.mockImplementation(() => {
        throw new UnauthorizedError('Invalid or expired token');
      });

      expect(() => {
        userService.updateExpiration(3, 'super-invalid-token');
      }).toThrow(UnauthorizedError);
      expect(prismaUserMock.updateExpiration).not.toHaveBeenCalled();
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
});
