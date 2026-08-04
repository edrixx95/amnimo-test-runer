import path from "node:path";
import fs from "node:fs/promises";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const fileName = body?.fileName;

  if (!fileName) {
    throw createError({
      statusCode: 400,
      statusMessage: "File name is required",
    });
  }

  const generatedDir = process.env.APP_DATA_PATH
    ? path.join(process.env.APP_DATA_PATH, "generated-specs")
    : path.resolve(process.cwd(), "generated-specs");

  const targetPath = path.join(generatedDir, fileName);

  try {
    await fs.unlink(targetPath);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete file", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete file",
    });
  }
});
