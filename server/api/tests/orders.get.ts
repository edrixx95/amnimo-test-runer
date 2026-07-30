 
/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "node:fs/promises";
import path from "node:path";
import { getSettings } from "../../utils/settingsManager";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  let type = (query.type as string) || "release";
  const board = query.board as string;
  const device = query.device as string;

  if (type === "playground") {
    type = "release";
  }
  const dirPath = path.join(getSettings().e2ePath, `test-order/${type}`);

  try {
    let jsonFiles: string[] = [];
    
    if (board) {
      const fileName = device && device !== "None" ? `${board}-${device}.json` : `${board}.json`;
      jsonFiles = [fileName];
    } else {
      const files = await fs.readdir(dirPath);
      jsonFiles = files.filter((f) => f.endsWith(".json"));
    }

    const results = [];
    for (const file of jsonFiles) {
      try {
        const content = await fs.readFile(path.join(dirPath, file), "utf-8");
        const tests = JSON.parse(content);
        results.push({
          name: file,
          tests: Array.isArray(tests) ? tests : [],
        });
      } catch (_e: unknown) {
        if (board) {
          // If a specific board was requested but not found, just return empty instead of logging error
          continue;
        }
        console.error(`Invalid JSON or file not found: ${file}`);
      }
    }

    return results;
  } catch (e: unknown) {
    const error = e as any;
    if ((error as { code?: string }).code === "ENOENT") {
      return []; // No test orders yet
    }
    console.error("Failed to read test orders:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to read test orders",
    });
  }
});
