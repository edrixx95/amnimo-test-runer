import fs from "node:fs/promises";
import path from "node:path";
import type { Session } from "../../../shared/types";
import { getAggregatedReport } from "../../utils/reportUtils";

const SESSIONS_DIR = process.env.APP_DATA_PATH
  ? path.join(process.env.APP_DATA_PATH, "sessions")
  : path.resolve(process.cwd(), "sessions");

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Session ID is required",
    });
  }

  try {
    const sessionDir = path.join(SESSIONS_DIR, id);
    const sessionPath = path.join(sessionDir, "session.json");

    const data = await fs.readFile(sessionPath, "utf-8");
    const session: Session = JSON.parse(data);

    if (session.status === "Completed" || session.status === "Failed") {
      try {
        const aggregated = await getAggregatedReport(session.id, session);
        if (aggregated._meta.failed > 0) {
          session.status = "Failed";
        } else {
          session.status = "Completed";
        }
      } catch (err) {
        console.error(`Failed to aggregate status for ${session.id}:`, err);
      }
    }

    return session;
  } catch (error: any) {
    console.error("Failed to get session:", error);
    throw createError({
      statusCode: 404,
      statusMessage: "Session not found",
    });
  }
});
