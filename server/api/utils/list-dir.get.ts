import fs from "node:fs";
import path from "node:path";
import os from "node:os";

export default defineEventHandler((event) => {
  const query = getQuery(event);
  let targetPath = (query.path as string) || "";

  if (!targetPath) {
    targetPath = os.homedir();
  } else {
    targetPath = path.resolve(targetPath);
  }

  try {
    if (!fs.existsSync(targetPath)) {
      targetPath = os.homedir();
    }

    const items = fs.readdirSync(targetPath, { withFileTypes: true });

    // We only care about directories for a folder picker
    const folders = items
      .filter((dirent) => {
        try {
          // Ignore hidden folders starting with dot or system folders
          if (dirent.name.startsWith(".")) return false;
          return dirent.isDirectory();
        } catch {
          return false; // Handle permission errors on stat
        }
      })
      .map((dirent) => dirent.name)
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

    const parentPath = path.dirname(targetPath);
    const hasParent = parentPath !== targetPath; // In windows, dirname('C:\\') is 'C:\\'

    return {
      currentPath: targetPath,
      parentPath: hasParent ? parentPath : null,
      folders,
    };
  } catch (_e: unknown) {
    const e = _e as import('~~/shared/types').CatchError;
    const err = e as { message?: string, statusCode?: number, statusMessage?: string };
    throw createError({
      statusCode: 400,
      statusMessage: (err as { response?: { status?: number }, statusCode?: number, message?: string, statusMessage?: string, code?: string }).message || "Access denied or invalid path",
    });
  }
});
