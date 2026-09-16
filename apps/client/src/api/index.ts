import { createAuthApi, type AuthApi } from './auth.api';
import { createApiClient, type ApiClient } from './client';

export interface Api {
  auth: AuthApi;
}

export function createApi(apiClient: ApiClient): Api {
  return {
    auth: createAuthApi(apiClient),
  };
}

const apiClient = createApiClient(fetch);
export const api = createApi(apiClient);
