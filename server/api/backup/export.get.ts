import AdmZip from "adm-zip";
import { getSessionsDir } from "../../utils/sessionManager";
import fs from "node:fs";

export default defineEventHandler(async (event) => {
  const sessionsDir = getSessionsDir();

  if (!fs.existsSync(sessionsDir)) {
    throw createError({
      statusCode: 404,
      statusMessage: "Sessions directory not found",
    });
  }

  const zip = new AdmZip();

  // Add the entire sessions directory content to the root of the zip
  zip.addLocalFolder(sessionsDir);

  const buffer = zip.toBuffer();

  setResponseHeader(event, "Content-Type", "application/zip");
  setResponseHeader(
    event,
    "Content-Disposition",
    'attachment; filename="amnimo-sessions-backup.zip"',
  );

  return buffer;
});
