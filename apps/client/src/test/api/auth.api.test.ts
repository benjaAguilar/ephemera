import { describe, expect, it, vi } from 'vitest';
import { createAuthApi } from '../../api/auth.api';
import { type ApiClient } from '../../api/client';
import { ApiError } from '../../utils/customError';

const user = { id: 1, username: 'rick', expiresIn: new Date() };

const mockApiClient: ApiClient = {
  get: vi.fn().mockReturnValue(user),
  post: vi.fn(),
};
const auth = createAuthApi(mockApiClient);

describe('Auth API', () => {
  describe('getCurrentUser()', () => {
    it('Should return the retrived user and call get with expected params', async () => {
      const user = await auth.getCurrentUser();

      expect(user).toEqual(user);
      expect(mockApiClient.get).toHaveBeenCalledWith('/api/auth/session');
    });

    it('Should return null if fetch call returns a 401 unauthorized', async () => {
      vi.mocked(mockApiClient.get).mockRejectedValueOnce(new ApiError(401, 'Unauthorized'));

      const user = await auth.getCurrentUser();

      expect(user).toBeNull();
    });

    it('Should throw an unexpected error if happens', async () => {
      vi.mocked(mockApiClient.get).mockRejectedValueOnce(
        new ApiError(500, 'Internal server error'),
      );

      await expect(async () => await auth.getCurrentUser()).rejects.toThrow(ApiError);
    });
  });

  describe('createUser()', () => {
    it('Should call /api/auth with expected username and ttl', async () => {
      await auth.createUser('rick', '15m');
      expect(mockApiClient.post).toHaveBeenCalledWith('/api/auth', {
        username: 'rick',
        ttl: '15m',
      });
    });

    it('Should throw an unexpected error if happens', async () => {
      vi.mocked(mockApiClient.post).mockRejectedValueOnce(
        new ApiError(500, 'Internal server error'),
      );

      await expect(async () => await auth.createUser('rick', '30m')).rejects.toThrow(ApiError);
    });
  });
});
