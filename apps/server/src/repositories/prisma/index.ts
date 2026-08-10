import { prisma } from '../../lib/prisma.js';
import { createPrismaUser } from './prismaUser.repository.js';

export const prismaUser = createPrismaUser(prisma);
