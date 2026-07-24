import AdmZip from "adm-zip";
import { getSessionsDir } from "../../utils/sessionManager";
import fs from "node:fs";

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event);

  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "No file uploaded",
    });
  }

  const file = formData.find((f) => f.name === "file");
  if (!file || !file.data) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid file data",
    });
  }

  const sessionsDir = getSessionsDir();

  // Create sessions dir if not exists
  if (!fs.existsSync(sessionsDir)) {
    fs.mkdirSync(sessionsDir, { recursive: true });
  }

  try {
    const zip = new AdmZip(file.data);
    // Extract to sessionsDir, overwriting existing files
    zip.extractAllTo(sessionsDir, true);

    return { success: true, message: "Backup imported successfully" };
  } catch (_e: unknown) {
    const e = _e as import('~~/shared/types').CatchError;
    console.error("Import backup failed:", e);
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to import backup: ${(e as { response?: { status?: number }, statusCode?: number, message?: string, statusMessage?: string, code?: string }).message}`,
    });
  }
});
