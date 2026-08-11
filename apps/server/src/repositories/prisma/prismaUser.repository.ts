import type { PrismaClient } from '../../../prisma/generated/prisma/client.js';
import type { UserRepository } from '../user.repository.js';

export function createPrismaUser(prisma: PrismaClient): UserRepository {
  return {
    create(username) {
      return prisma.user.create({
        data: {
          username,
        },
      });
    },

    updateExpiration(userId, expirationDate) {
      return prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          expiresIn: expirationDate,
        },
      });
    },
  };
}
