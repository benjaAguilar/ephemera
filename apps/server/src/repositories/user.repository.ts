import type { RegisterType } from '@ephemera/schemas';
import type { User } from '../../prisma/generated/prisma/client.js';

export interface UserRepository {
  create(username: RegisterType['username'], expiresIn: Date): Promise<User>;
}
