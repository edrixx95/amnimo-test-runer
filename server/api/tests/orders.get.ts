 
/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "node:fs/promises";
import path from "node:path";
import { getSettings } from "../../utils/settingsManager";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  let type = (query.type as string) || "release";
  if (type === "playground") {
    type = "release";
  }
  const dirPath = path.join(getSettings().e2ePath, `test-order/${type}`);

  try {
    const files = await fs.readdir(dirPath);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));

    const results = [];
    for (const file of jsonFiles) {
      const content = await fs.readFile(path.join(dirPath, file), "utf-8");
      try {
        const tests = JSON.parse(content);
        results.push({
          name: file,
          tests: Array.isArray(tests) ? tests : [],
        });
      } catch (_e: unknown) {
        console.error(`Invalid JSON in ${file}`);
      }
    }

    return results;
  } catch (e: unknown) {
    const error = e as any;
    if ((error as { response?: { status?: number }, statusCode?: number, message?: string, statusMessage?: string, code?: string }).code === "ENOENT") {
      return []; // No test orders yet
    }
    console.error("Failed to read test orders:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to read test orders",
    });
  }
});
