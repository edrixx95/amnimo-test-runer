import fs from 'node:fs';
import path from 'node:path';
import { getSettings } from '../../utils/settingsManager';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { destinationPath, files } = body;

    if (!destinationPath) {
      throw createError({ statusCode: 400, statusMessage: 'Destination path is required' });
    }

    if (!files || !Array.isArray(files) || files.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'Files to copy are required' });
    }

    if (!fs.existsSync(destinationPath)) {
      throw createError({ statusCode: 400, statusMessage: `Destination path does not exist: ${destinationPath}` });
    }

    const stat = fs.statSync(destinationPath);
    if (!stat.isDirectory()) {
      throw createError({ statusCode: 400, statusMessage: `Destination path is not a directory: ${destinationPath}` });
    }

    const uploadDir = path.join(getSettings().e2ePath, 'upload');
    const copiedFiles: string[] = [];

    for (const file of files) {
      const sourcePath = path.join(uploadDir, file);
      if (!fs.existsSync(sourcePath)) {
        throw createError({ statusCode: 404, statusMessage: `Source file not found: ${file}` });
      }

      const destFilePath = path.join(destinationPath, file);
      fs.copyFileSync(sourcePath, destFilePath);
      copiedFiles.push(file);
    }

    return { success: true, copiedFiles };
  } catch (err: any) {
    console.error('Copy error:', err);
    throw createError({ statusCode: 500, statusMessage: err.message || 'Copy failed' });
  }
});
