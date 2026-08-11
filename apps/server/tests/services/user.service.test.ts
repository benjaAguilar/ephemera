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
  updateExpiration: vi.fn(),
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
});
