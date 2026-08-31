import type { PrismaClient } from '@prisma/client/extension';
import { createPrismaUser } from './prismaUser.repository.js';
import type { UserRepository } from '../user.repository.js';

export interface Repositories {
  prismaUser: UserRepository;
}

export function createRepositories(prisma: PrismaClient): Repositories {
  return {
    prismaUser: createPrismaUser(prisma),
  };
}
