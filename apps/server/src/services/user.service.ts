import type { RegisterType } from '@ephemera/schemas';
import type { UserRepository } from '../repositories/user.repository.js';
import { verifyJWT } from '../utils/jwtUtils.js';
import type { User } from '../../prisma/generated/prisma/client.js';

export interface UserService {
  create(username: RegisterType['username']): Promise<User>;
  updateExpiration(userId: number, signedToken: string): Promise<User>;
}

export function createUserService(prismaRepo: UserRepository): UserService {
  return {
    create(username) {
      return prismaRepo.create(username);
    },

    updateExpiration(userId, signedToken) {
      const decoded = verifyJWT(signedToken);
      const expirationDate = new Date(decoded.exp * 1000);

      // TODO: verify if userId = decoded.sub

      return prismaRepo.updateExpiration(userId, expirationDate);
    },
  };
}
