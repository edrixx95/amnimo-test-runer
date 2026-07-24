export interface LockInfo {
  resource: string;
  sessionId: string;
  acquiredAt: number;
}

const locks = new Map<string, LockInfo>();

export const lockManager = {
  /**
   * Acquires a lock for a specific resource.
   * If the lock is already held by another session, returns false.
   * If the lock is held by the SAME session, returns true (re-entrant).
   */
  acquire(resource: string, sessionId: string): boolean {
    const existingLock = locks.get(resource);

    if (existingLock) {
      if (existingLock.sessionId === sessionId) {
        // Re-entrant, already holds the lock
        return true;
      }
      return false; // Held by someone else
    }

    locks.set(resource, {
      resource,
      sessionId,
      acquiredAt: Date.now(),
    });

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
   * Get lock info for a resource.
   */
  getLock(resource: string): LockInfo | undefined {
    return locks.get(resource);
  },

  /**
   * Clear all locks (useful for forceful resets or admin actions).
   */
  clearAll() {
    locks.clear();
  },
};
