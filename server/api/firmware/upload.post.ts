import fs from "node:fs";
import path from "node:path";
import { getSettings } from "../../utils/settingsManager";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const filename = query.filename as string;

    if (!filename) {
      throw createError({
        statusCode: 400,
        statusMessage: "No filename provided",
      });
    }

    const uploadDir = path.join(getSettings().e2ePath, "upload");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);

    // Stream the raw body to the file
    await new Promise<void>((resolve, reject) => {
      const fileStream = fs.createWriteStream(filePath);

      event.node.req.pipe(fileStream);

      event.node.req.on("end", () => {
        fileStream.close();
        resolve();
      });

      event.node.req.on("error", (err) => {
        fileStream.close();
        reject(err);
      });
    });

    return { success: true, filename };
  } catch (e: unknown) {
    const err = e as import('~~/shared/types').CatchError;
    console.error("Upload error:", err);
    throw createError({
      statusCode: 500,
      statusMessage: (err as { response?: { status?: number }, statusCode?: number, message?: string, statusMessage?: string, code?: string }).message || "Upload failed",
    });
  }
});
