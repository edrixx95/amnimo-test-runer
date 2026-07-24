import fs from "node:fs/promises";
import path from "node:path";
import { SESSION_STATUS } from "~~/shared/constants";
import type { Session } from "~~/shared/types";

const SESSIONS_DIR = process.env.APP_DATA_PATH
  ? path.join(process.env.APP_DATA_PATH, "sessions")
  : path.resolve(process.cwd(), "sessions");

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, message: "Session ID is required" });
  }

  const sessionDir = path.join(SESSIONS_DIR, id);
  const sessionPath = path.join(sessionDir, "session.json");

  try {
    const data = await fs.readFile(sessionPath, "utf-8");
    const session: Session = JSON.parse(data);

    if (session.status === SESSION_STATUS.CLOSED) {
      throw createError({
        statusCode: 400,
        message: "Session is already closed",
      });
    }

    session.status = SESSION_STATUS.CLOSED;
    session.closedAt = new Date().toISOString();

    await fs.writeFile(sessionPath, JSON.stringify(session, null, 2), "utf-8");

    return session;
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("Failed to close session:", error);
    throw createError({ statusCode: 404, message: "Session not found" });
  }
});
