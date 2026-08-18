import type { BatchPayload } from '../../prisma/generated/prisma/internal/prismaNamespace.js';
import type { UserRepository } from '../repositories/user.repository.js';

export interface CleanupService {
  cleanExpiredUsers(): Promise<BatchPayload>;
}

export function createCleanupService(prismaRepo: UserRepository): CleanupService {
  return {
    cleanExpiredUsers() {
      return prismaRepo.deleteExpired();
    },
  };
}
