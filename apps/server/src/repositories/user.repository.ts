import type { RegisterType } from '@ephemera/schemas';
import type { User } from '../../prisma/generated/prisma/client.js';

export interface UserRepository {
  create(username: RegisterType['username']): Promise<User>;
  updateExpiration(userId: number, expirationDate: Date): Promise<User>;
  getById(userId: number): Promise<User | null>;
  getByUsername(username: string): Promise<User | null>;
}
