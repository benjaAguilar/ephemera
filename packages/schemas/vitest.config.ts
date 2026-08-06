import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // describe/it/expect sin importar
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    clearMocks: true,
  },
});
