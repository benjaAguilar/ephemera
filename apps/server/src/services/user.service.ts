import type { RegisterType } from '@ephemera/schemas';
import type { UserRepository } from '../repositories/user.repository.js';
import { verifyJWT } from '../utils/jwtUtils.js';
import type { User } from '../../prisma/generated/prisma/client.js';
import { ConflictError, NotFoundError } from '../utils/customError.js';

export interface UserService {
  create(username: RegisterType['username']): Promise<User>;
  updateExpiration(userId: number, signedToken: string): Promise<User>;
  getById(userId: number): Promise<User>;
  getByUsername(username: string): Promise<User>;
}

export function createUserService(prismaRepo: UserRepository): UserService {
  return {
    async create(username) {
      const user = await prismaRepo.getByUsername(username);

      if (user) {
        throw new ConflictError('Username already taken');
      }

      return prismaRepo.create(username);
    },

    updateExpiration(userId, signedToken) {
      const decoded = verifyJWT(signedToken);
      const expirationDate = new Date(decoded.exp * 1000);

      //TODO: verify if userId = decoded.sub
      // Update expiration should be strict about what its doing. can't return expiresIn beign null.
      // we should handle if userId has same decoded.sub. and if user exists. (see issue #111)

      return prismaRepo.updateExpiration(userId, expirationDate);
    },

    async getById(userId) {
      const user = await prismaRepo.getById(userId);

      if (!user) {
        throw new NotFoundError('User not found');
      }

      return user;
    },

    async getByUsername(username) {
      const user = await prismaRepo.getByUsername(username);

      if (!user) {
        throw new NotFoundError('User not found');
      }

      return user;
    },
  };
}
