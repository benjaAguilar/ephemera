import type { PrismaClient } from '../../../prisma/generated/prisma/client.js';
import type { UserRepository } from '../user.repository.js';

export function createPrismaUser(prisma: PrismaClient): UserRepository {
  return {
    create(username, expiresIn) {
      return prisma.user.create({
        data: {
          username,
          expiresIn,
        },
      });
    },
  };
}
