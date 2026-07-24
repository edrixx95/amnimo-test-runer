import path from "node:path";
import fs from "node:fs/promises";
import { getSettings } from "../../utils/settingsManager";

type FileNode = {
  name: string;
  type: "file" | "folder";
  path?: string;
  children?: FileNode[];
  cases?: string[];
};

async function buildFileTree(
  dir: string,
  baseDir: string,
): Promise<FileNode[]> {
  const nodes: FileNode[] = [];
  try {
    const list = await fs.readdir(dir, { withFileTypes: true });

    // Sort directories first, then files
    list.sort((a, b) => {
      if (a.isDirectory() === b.isDirectory()) {
        return a.name.localeCompare(b.name);
      }
      return a.isDirectory() ? -1 : 1;
    });

    for (const file of list) {
      const fullPath = path.join(dir, file.name);

      if (file.isDirectory()) {
        const children = await buildFileTree(fullPath, baseDir);
        if (children.length > 0) {
          nodes.push({
            name: file.name,
            type: "folder",
            children,
          });
        }
      } else if (file.name.endsWith(".spec.ts")) {
        const relativePath = path
          .relative(baseDir, fullPath)
          .replace(/\\/g, "/");
        nodes.push({
          name: file.name,
          type: "file",
          path: relativePath,
          cases: undefined, // Undefined indicates cases haven't been loaded yet
        });
      }
    }
  } catch (e) {
    console.error(`Error reading directory ${dir}:`, e);
  }
  return nodes;
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  let type = (query.type as string) || "release";
  if (type === "playground") {
    type = "release";
  }
  const e2eDir = getSettings().e2ePath;
  const targetDir = path.join(e2eDir, `playwright/tests/${type}`);

  try {
    const rootNodes = await buildFileTree(targetDir, targetDir);
    return rootNodes;
  } catch (_e: unknown) {
    const e = _e as import('~~/shared/types').CatchError;
    const error = e as { message?: string, statusCode?: number, statusMessage?: string };
    console.error("Failed to read test files:", error);
    throw createError({
      statusCode: 500,
      statusMessage: (error as { response?: { status?: number }, statusCode?: number, message?: string, statusMessage?: string, code?: string }).message || String(error),
    });
  }
});
