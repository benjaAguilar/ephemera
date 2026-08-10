import type { RegisterType } from '@ephemera/schemas';
import type { UserRepository } from '../repositories/user.repository.js';
import { verifyJWT } from '../utils/jwtUtils.js';
import type { User } from '../../prisma/generated/prisma/client.js';

export interface UserService {
  create(username: RegisterType['username'], signedToken: string): Promise<User>;
}

export function createUserService(prismaRepo: UserRepository): UserService {
  return {
    create(username, signedToken: string) {
      const decoded = verifyJWT(signedToken);
      const expirationDate = new Date(decoded.exp * 1000);

      return prismaRepo.create(username, expirationDate);
    },
  };
}
