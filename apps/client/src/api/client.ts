import { ApiError } from '../utils/customError';

export interface ApiClient {
  get<T>(path: string): Promise<T>;
  post<T>(path: string, body?: unknown): Promise<T>;
}

export function createApiClient(fetchFn: typeof fetch): ApiClient {
  return {
    async get(path) {
      const res = await fetchFn(path, {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new ApiError(res.status, 'Error at ApiClient GET');
      }

      return res.json();
    },

    async post(path, body) {
      const res = await fetchFn(path, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : null,
      });

      if (!res.ok) {
        throw new ApiError(res.status, 'Error at ApiClient POST');
      }

      return res.json();
    },
  };
}
