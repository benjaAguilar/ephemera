import { describe, it, expect, vi } from 'vitest';
import type { UserRepository } from '../../src/repositories/user.repository.js';
import { createUserService } from '../../src/services/user.service.js';
import { verifyJWT } from '../../src/utils/jwtUtils.js';
import { UnauthorizedError } from '../../src/utils/customError.js';

vi.mock('../../src/utils/jwtUtils.ts', () => ({
  verifyJWT: vi.fn(),
}));

const prismaUserMock: UserRepository = {
  create: vi.fn(),
};
const verifyJwtMock = vi.mocked(verifyJWT);
const userService = createUserService(prismaUserMock);

describe('UserService', () => {
  describe('create()', () => {
    it('should create an user whit token expiration date', () => {
      const expiration = Math.floor(Date.now() / 1000) + 3600;

      verifyJwtMock.mockReturnValue({
        userId: 1,
        exp: expiration,
        iat: expiration,
      });
      userService.create('rick', 'super-valid-token');

      expect(prismaUserMock.create).toHaveBeenCalledOnce();
      expect(prismaUserMock.create).toHaveBeenCalledWith('rick', new Date(expiration * 1000));
    });

    it('should not create an user when token verification fails', () => {
      verifyJwtMock.mockImplementation(() => {
        throw new UnauthorizedError('Invalid or expired token');
      });

      expect(() => {
        userService.create('rick', 'super-invalid-token');
      }).toThrow(UnauthorizedError);
      expect(prismaUserMock.create).not.toHaveBeenCalled();
    });
  });
});
