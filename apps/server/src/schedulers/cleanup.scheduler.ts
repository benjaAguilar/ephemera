import type { CleanupService } from '../services/cleanup.service.js';

export const CLEANUP_INTERVAL = 60_000;

export function startCleanupScheduler(cleanupService: CleanupService) {
  const run = async () => {
    try {
      const res = await cleanupService.cleanExpiredUsers();
      console.info(`Cleanup ${res.count} expired users`);
    } catch (err) {
      console.error('Failed to cleanup expired users:', err);
    } finally {
      setTimeout(run, CLEANUP_INTERVAL);
    }
  };

  run();
}
