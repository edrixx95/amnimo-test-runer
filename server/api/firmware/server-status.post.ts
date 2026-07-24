import fs from "node:fs";
import path from "node:path";
import { getSettings } from "../../utils/settingsManager";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { destinationPath, files } = body;

    if (
      !destinationPath ||
      !files ||
      !Array.isArray(files) ||
      files.length === 0
    ) {
      return { allExist: false };
    }

    if (!fs.existsSync(destinationPath)) {
      return { allExist: false };
    }

    const uploadDir = path.join(getSettings().e2ePath, "upload");

    let allExist = true;
    for (const file of files) {
      const destFilePath = path.join(destinationPath, file);
      if (!fs.existsSync(destFilePath)) {
        allExist = false;
        break;
      }

      // Optionally check if size matches to ensure it's not a partial/old file
      const sourceFilePath = path.join(uploadDir, file);
      if (fs.existsSync(sourceFilePath)) {
        try {
          const srcStat = fs.statSync(sourceFilePath);
          const destStat = fs.statSync(destFilePath);
          if (srcStat.size !== destStat.size) {
            allExist = false;
            break;
          }
        } catch {
          allExist = false;
          break;
        }
      }
    }

    return { allExist };
  } catch (err) {
    return { allExist: false };
  }
});
