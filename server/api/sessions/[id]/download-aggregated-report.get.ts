import fs from "node:fs/promises";
import path from "node:path";
import { getAggregatedReport } from "../../../utils/reportUtils";
import type { Session } from "../../../../shared/types";

const SESSIONS_DIR = process.env.APP_DATA_PATH
  ? path.join(process.env.APP_DATA_PATH, "sessions")
  : path.resolve(process.cwd(), "sessions");

export default defineEventHandler(async (event) => {
  const sessionId = getRouterParam(event, "id");
  if (!sessionId) {
    throw createError({ statusCode: 400, statusMessage: "Session ID required" });
  }

  let session: Session;
  try {
    const sessionDir = path.join(SESSIONS_DIR, sessionId);
    const sessionPath = path.join(sessionDir, "session.json");
    const data = await fs.readFile(sessionPath, "utf-8");
    session = JSON.parse(data);
  } catch (error) {
    throw createError({ statusCode: 404, statusMessage: "Session not found" });
  }

  const aggregated = await getAggregatedReport(sessionId, session);

  // Map the aggregated report to the clean format the user requested
  const cleanCategories = aggregated.categories.map((cat: any) => ({
    category: cat.category,
    pages: cat.pages.map((page: any) => ({
      page: page.page,
      tests: page.tests.map((test: any) => ({
        "test-id": test["test-id"],
        "result": test.latest_result || "-",
        "test-device-model": test["test-device-model"] || "Unknown",
        "test-device-serial": test["test-device-serial"] || "",
        "test-date": test["test-date"] || "",
        "test-fw": test["test-fw"] || ""
      }))
    }))
  }));

  // Set headers to trigger a file download
  setResponseHeader(event, "Content-Type", "application/json");
  setResponseHeader(
    event,
    "Content-Disposition",
    `attachment; filename="report-${session.name || sessionId}.json"`
  );

  return {
    categories: cleanCategories
  };
});
