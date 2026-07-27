import { EventEmitter } from "node:events";

export interface LockInfo {
  resource: string;
  sessionId: string;
  sessionName?: string;
  acquiredAt: number;
}

const locks = new Map<string, LockInfo>();
const lockEvents = new EventEmitter();

export const lockManager = {
  /**
   * Acquires a lock for a specific resource.
   * If the lock is already held by another session, returns false.
   * If the lock is held by the SAME session, returns true (re-entrant).
   */
  acquire(resource: string, sessionId: string, sessionName?: string): boolean {
    const existingLock = locks.get(resource);

    if (existingLock) {
      if (existingLock.sessionId === sessionId) {
        // Re-entrant, already holds the lock. Update sessionName if provided.
        if (sessionName) {
          existingLock.sessionName = sessionName;
        }
        return true;
      }
      return false; // Held by someone else
    }

    const lockInfo: LockInfo = {
      resource,
      sessionId,
      sessionName,
      acquiredAt: Date.now(),
    };

    locks.set(resource, lockInfo);
    lockEvents.emit("lock_acquired", lockInfo);

    return true;
  },

  /**
   * Releases a lock for a specific resource.
   * Only the session that acquired the lock can release it, unless force=true.
   */
  release(
    resource: string,
    sessionId: string,
    force: boolean = false,
  ): boolean {
    const existingLock = locks.get(resource);

    if (!existingLock) {
      return true; // Already unlocked
    }

    if (existingLock.sessionId === sessionId || force) {
      locks.delete(resource);
      lockEvents.emit("lock_released", existingLock);
      return true;
    }

    return false; // Cannot release someone else's lock
  },

  /**
   * Check if a resource is locked.
   */
  isLocked(resource: string): boolean {
    return locks.has(resource);
  },

  /**
   * Release all locks held by a specific session (useful for cleanup).
   */
  releaseAllForSession(sessionId: string): void {
    const locksToRelease = [];
    for (const [resource, lockInfo] of locks.entries()) {
      if (lockInfo.sessionId === sessionId) {
        locksToRelease.push(lockInfo);
      }
    }
    for (const lockInfo of locksToRelease) {
      locks.delete(lockInfo.resource);
      lockEvents.emit("lock_released", lockInfo);
      console.log(`[LockManager] Auto-released lock on resource '${lockInfo.resource}' for session '${sessionId}'`);
    }
  },

  /**
   * Get lock info for a resource.
   */
  getLock(resource: string): LockInfo | undefined {
    return locks.get(resource);
  },

  /**
   * Get all active locks.
   */
  getAllLocks(): LockInfo[] {
    return Array.from(locks.values());
  },

  /**
   * Clear all locks (useful for forceful resets or admin actions).
   */
  clearAll() {
    locks.clear();
  },

  /**
   * Expose the event emitter for streaming endpoints
   */
  events: lockEvents,
};
