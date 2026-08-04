import path from "node:path";
import fs from "node:fs/promises";

const getGeneratedDir = () => {
  return process.env.APP_DATA_PATH
    ? path.join(process.env.APP_DATA_PATH, "generated-specs")
    : path.resolve(process.cwd(), "generated-specs");
};

export default defineEventHandler(async (event) => {
  const generatedDir = getGeneratedDir();
  try {
    await fs.mkdir(generatedDir, { recursive: true });
    const items = await fs.readdir(generatedDir, { withFileTypes: true });

    const files = [];
    for (const item of items) {
      if (
        item.isFile() &&
        item.name.endsWith(".xlsx") &&
        !item.name.startsWith("~$")
      ) {
        const stat = await fs.stat(path.join(generatedDir, item.name));
        files.push({
          name: item.name,
          path: path.join(generatedDir, item.name),
          size: stat.size,
          updatedAt: stat.mtime,
        });
      }
    }

    return files.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  } catch (error) {
    console.error("Failed to list generated specs", error);
    return [];
  }
});
