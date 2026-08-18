import { prismaUser } from '../repositories/prisma/index.js';
import { createCleanupService } from './cleanup.service.js';
import { createUserService } from './user.service.js';

export const userService = createUserService(prismaUser);
export const cleanupService = createCleanupService(prismaUser);
