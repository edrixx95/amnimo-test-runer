import fs from "node:fs";
import path from "node:path";
import { getSettings } from "../../utils/settingsManager";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { sourcePath, files } = body;

    if (!sourcePath || !files || !Array.isArray(files) || files.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing parameters",
      });
    }

    const uploadDir = path.join(getSettings().e2ePath, "upload");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const copiedFiles: string[] = [];

    for (const file of files) {
      const srcFile = path.join(sourcePath, file);
      if (!fs.existsSync(srcFile)) {
        continue;
      }
      fs.copyFileSync(srcFile, path.join(uploadDir, file));
      copiedFiles.push(file);
    }

    return { success: true, copiedFiles };
  } catch (e: unknown) {
    const err = e as import('~~/shared/types').CatchError;
    console.error("Copy from server error:", err);
    throw createError({
      statusCode: 500,
      statusMessage: (err as { response?: { status?: number }, statusCode?: number, message?: string, statusMessage?: string, code?: string }).message || "Copy failed",
    });
  }
});
