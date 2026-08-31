import { type Repositories } from '../repositories/prisma/index.js';
import { createCleanupService, type CleanupService } from './cleanup.service.js';
import { createUserService, type UserService } from './user.service.js';

export interface Services {
  userService: UserService;
  cleanupService: CleanupService;
}

export function createServices(repos: Repositories): Services {
  return {
    userService: createUserService(repos.prismaUser),
    cleanupService: createCleanupService(repos.prismaUser),
  };
}
