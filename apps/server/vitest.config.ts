import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    clearMocks: true,
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['./tests/unit/**/*.test.ts'],
          env: {
            SECRET_JWT: 'super-secret-key',
          },
        },
      },
      {
        extends: true,
        test: {
          name: 'integration',
          include: ['./tests/integration/**/*.test.ts'],
          globalSetup: ['./tests/integration/globalSetup.ts'],
          setupFiles: ['./tests/integration/setup.ts'],
          fileParallelism: false,
        },
      },
    ],
  },
});
