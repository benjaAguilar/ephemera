import { prismaUser } from '../repositories/prisma/index.js';
import { createUserService } from './user.service.js';

export const userService = createUserService(prismaUser);
