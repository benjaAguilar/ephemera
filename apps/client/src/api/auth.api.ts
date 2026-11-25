import type { CurrentUserType, RegisterType } from '@ephemera/schemas';
import type { ApiClient } from './client';
import { ApiError } from '../utils/customError';

export interface AuthApi {
  getCurrentUser(): Promise<CurrentUserType | null>;
  createUser(username: string, ttl: RegisterType['ttl']): Promise<void>;
}

export function createAuthApi(api: ApiClient): AuthApi {
  return {
    async getCurrentUser() {
      try {
        const user = await api.get<CurrentUserType>('/api/auth/session');
        return user;
      } catch (error) {
        if (error instanceof ApiError && error.statusCode === 401) {
          return null;
        }

        throw error;
      }
    },

    async createUser(username, ttl) {
      await api.post('/api/auth', { username, ttl });
    },
  };
}
