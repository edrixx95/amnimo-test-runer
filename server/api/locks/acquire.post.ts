import { lockManager } from "../../utils/lockManager";
import path from "node:path";
import fs from "node:fs/promises";
import type { Session } from "../../../shared/types";

const SESSIONS_DIR = process.env.APP_DATA_PATH
  ? path.join(process.env.APP_DATA_PATH, "sessions")
  : path.resolve(process.cwd(), "sessions");

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { resource, sessionId } = body;

  if (!resource || !sessionId) {
    throw createError({
      statusCode: 400,
      statusMessage: "resource and sessionId are required",
    });
  }

  let sessionName = sessionId;
  try {
    const sessionPath = path.join(SESSIONS_DIR, sessionId, "session.json");
    const data = await fs.readFile(sessionPath, "utf-8");
    const session: Session = JSON.parse(data);
    if (session && session.name) {
      sessionName = session.name;
    }
  } catch (e) {
    // ignore
  }

  // Default to waiting up to 60 minutes
  const timeoutMs = body.timeoutMs !== undefined ? body.timeoutMs : 60 * 60 * 1000;

  const start = Date.now();
  while (true) {
    if (lockManager.acquire(resource, sessionId, sessionName)) {
      console.log(`[LockManager] Acquired lock on resource '${resource}' for session '${sessionId}'`);
      return { success: true, resource, sessionId, sessionName };
    }

    if (timeoutMs > 0 && Date.now() - start >= timeoutMs) {
      break;
    }

    // Sleep a bit before polling again
    await new Promise((r) => setTimeout(r, 1000));
  }

  // Failed to acquire lock
  const currentLock = lockManager.getLock(resource);
  throw createError({
    statusCode: 409, // Conflict
    statusMessage: `Resource ${resource} is currently locked by session ${currentLock?.sessionId}`,
  });
});
