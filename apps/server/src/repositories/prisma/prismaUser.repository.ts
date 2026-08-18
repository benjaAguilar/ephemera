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

    getById(userId) {
      return prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
    },

    getByUsername(username) {
      return prisma.user.findUnique({
        where: {
          username: username,
        },
      });
    },

    delete(userId) {
      return prisma.user.delete({
        where: {
          id: userId,
        },
      });
    },

    deleteExpired() {
      return prisma.user.deleteMany({
        where: {
          expiresIn: {
            lte: new Date(),
          },
        },
      });
    },
  };
}
