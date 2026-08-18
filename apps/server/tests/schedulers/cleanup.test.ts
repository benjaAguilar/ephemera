import { describe, it, expect, vi, afterEach } from 'vitest';
import type { CleanupService } from '../../src/services/cleanup.service.js';
import { CLEANUP_INTERVAL, startCleanupScheduler } from '../../src/schedulers/cleanup.scheduler.js';
import type { BatchPayload } from '../../prisma/generated/prisma/internal/prismaNamespace.js';
import { AppError } from '../../src/utils/customError.js';

const cleanupServiceMock: CleanupService = {
  cleanExpiredUsers: vi.fn().mockResolvedValue({ count: 0 }),
};

describe('startCleanupScheduler', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('Should run the cleanup inmediatly', () => {
    vi.useFakeTimers();

    startCleanupScheduler(cleanupServiceMock);

    expect(cleanupServiceMock.cleanExpiredUsers).toHaveBeenCalledOnce();
  });

  it('Should schedule another cleanup 1min after the previous one finishes', async () => {
    vi.useFakeTimers();

    startCleanupScheduler(cleanupServiceMock);

    await vi.advanceTimersByTimeAsync(CLEANUP_INTERVAL);

    expect(cleanupServiceMock.cleanExpiredUsers).toHaveBeenCalledTimes(2);
  });

  it('Should not overlap cleanup executions', async () => {
    vi.useFakeTimers();

    let resolveCleanup!: (val: BatchPayload) => void;
    const cleanupPromise = new Promise<BatchPayload>((resolve) => {
      resolveCleanup = resolve;
    });

    const notResolvedCleanupMock: CleanupService = {
      cleanExpiredUsers: vi.fn(() => cleanupPromise),
    };

    startCleanupScheduler(notResolvedCleanupMock);

    expect(notResolvedCleanupMock.cleanExpiredUsers).toHaveBeenCalledOnce();

    await vi.advanceTimersByTimeAsync(CLEANUP_INTERVAL);

    expect(notResolvedCleanupMock.cleanExpiredUsers).toHaveBeenCalledOnce();

    resolveCleanup({ count: 0 });

    await vi.advanceTimersByTimeAsync(CLEANUP_INTERVAL);

    expect(notResolvedCleanupMock.cleanExpiredUsers).toHaveBeenCalledTimes(2);
  });

  it('Continues scheduling after a cleanup failure', async () => {
    vi.useFakeTimers();

    vi.mocked(cleanupServiceMock.cleanExpiredUsers).mockRejectedValueOnce(
      new AppError(500, 'service failure'),
    );

    startCleanupScheduler(cleanupServiceMock);

    await vi.advanceTimersByTimeAsync(CLEANUP_INTERVAL);

    expect(cleanupServiceMock.cleanExpiredUsers).toHaveBeenCalledTimes(2);
  });
});
