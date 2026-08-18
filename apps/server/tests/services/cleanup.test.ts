import { describe, it, expect, vi } from 'vitest';
import type { UserRepository } from '../../src/repositories/user.repository.js';
import { createCleanupService } from '../../src/services/cleanup.service.js';

const prismaUserMock: UserRepository = {
  create: vi.fn(),
  updateExpiration: vi.fn(),
  getById: vi.fn(),
  getByUsername: vi.fn(),
  delete: vi.fn(),
  deleteExpired: vi.fn(),
};

const cleanupService = createCleanupService(prismaUserMock);

describe('cleanup service', () => {
  describe('cleanExpiredUsers()', () => {
    it('should call prisma delete expired', async () => {
      await cleanupService.cleanExpiredUsers();
      expect(prismaUserMock.deleteExpired).toHaveBeenCalled();
    });

    it('should return expected deletion count', async () => {
      vi.mocked(prismaUserMock.deleteExpired).mockResolvedValueOnce({ count: 32 });

      const res = await cleanupService.cleanExpiredUsers();
      expect(prismaUserMock.deleteExpired).toHaveBeenCalled();
      expect(res).toBeDefined();
      expect(res).toEqual({ count: 32 });
    });
  });
});
