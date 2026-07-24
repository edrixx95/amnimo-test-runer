import fs from "node:fs/promises";
import path from "node:path";
import {
  clearSessionProcesses,
  getSessionProcesses,
  killProcessesByFile,
} from "../../utils/processManager";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { sessionId } = body;

  if (!sessionId) {
    throw createError({ statusCode: 400, statusMessage: "Missing sessionId" });
  }

  // Use file-based PIDs to ensure we can kill it even if the worker restarted
  await killProcessesByFile(sessionId);

  // Also clear in-memory streams if they happen to be in the same worker
  clearSessionProcesses(sessionId);

  try {
    const SESSIONS_DIR = process.env.APP_DATA_PATH
      ? path.join(process.env.APP_DATA_PATH, "sessions")
      : path.resolve(process.cwd(), "sessions");
    const sessionPath = path.join(SESSIONS_DIR, sessionId, "session.json");
    const data = await fs.readFile(sessionPath, "utf-8");
    const session = JSON.parse(data);
    session.status = "Failed";
    session.updatedAt = new Date().toISOString();
    await fs.writeFile(sessionPath, JSON.stringify(session, null, 2), "utf-8");

    // Also broadcast the state change to the frontend
    const sessionProcs = getSessionProcesses(sessionId);
    if (sessionProcs && sessionProcs.events) {
      sessionProcs.events.emit("status-update", "Failed");
    }
  } catch (err) {
    console.error("Failed to update session status on stop:", err);
  }

  return { success: true, message: "Processes killed successfully" };
});
