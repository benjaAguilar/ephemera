import type { RegisterType } from '@ephemera/schemas';
import type { UserRepository } from '../repositories/user.repository.js';
import { verifyJWT } from '../utils/jwtUtils.js';
import type { User } from '../../prisma/generated/prisma/client.js';
import { AppError, ConflictError, NotFoundError } from '../utils/customError.js';

export interface UserService {
  create(username: RegisterType['username']): Promise<User>;
  updateExpiration(userId: number, signedToken: string): Promise<Date>;
  getById(userId: number): Promise<User>;
  findById(userId: number): Promise<User | null>;
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

    async updateExpiration(userId, signedToken) {
      const decoded = verifyJWT(signedToken);
      const expirationDate = new Date(decoded.exp * 1000);

      const user = await prismaRepo.updateExpiration(userId, expirationDate);
      if (!user.expiresIn) {
        throw new AppError(500, 'ExpiresIn date was not set');
      }

      return user.expiresIn;
    },

    findById(userId) {
      return prismaRepo.getById(userId);
    },

    async getById(userId) {
      const user = await this.findById(userId);

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
