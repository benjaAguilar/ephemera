import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { execSync } from 'child_process';
import type { TestProject } from 'vitest/node';

declare module 'vitest' {
  export interface ProvidedContext {
    DATABASE_URL: string;
  }
}

let container: StartedPostgreSqlContainer;

export async function setup(project: TestProject) {
  container = await new PostgreSqlContainer('postgres:18-alpine')
    .withDatabase('test_db')
    .withUsername('test_user')
    .withPassword('test_pass')
    .start();

  const databaseUrl = container.getConnectionUri();

  project.provide('DATABASE_URL', databaseUrl);

  execSync('pnpm exec prisma db push', {
    env: { ...process.env, DATABASE_URL: databaseUrl },
  });

  (globalThis as any).__POSTGRES_CONTAINER__ = container;
}

export async function teardown() {
  await container?.stop();
}
