import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

const bodySchema = z.object({
  path: z.string().optional(),
  content: z.any().optional(),
  sourcePath: z.string().optional(),
  targetDir: z.string().optional(),
  fileName: z.string().optional(),
  isCopy: z.boolean().optional(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const result = bodySchema.safeParse(body);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid input parameters",
      data: result.error.format(),
    });
  }

  const {
    path: filePath,
    content,
    sourcePath,
    targetDir,
    fileName,
    isCopy,
  } = result.data;

  try {
    if (isCopy && sourcePath && targetDir && fileName) {
      const fullTargetPath = path.join(targetDir, fileName);
      await fs.mkdir(targetDir, { recursive: true });
      await fs.copyFile(sourcePath, fullTargetPath);
      return { success: true, path: fullTargetPath };
    }

    if (!filePath) {
      throw createError({
        statusCode: 400,
        statusMessage: "path is required if not copying",
      });
    }

    const parentDir = path.dirname(filePath);
    await fs.mkdir(parentDir, { recursive: true });

    let dataToWrite = content;
    if (typeof content === "object" && content !== null) {
      dataToWrite = JSON.stringify(content, null, 2);
    }

    await fs.writeFile(filePath, dataToWrite, "utf-8");

    return { success: true, path: filePath };
  } catch (error: any) {
    console.error("Failed to save file:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to save file",
      message: error.message,
    });
  }
});
