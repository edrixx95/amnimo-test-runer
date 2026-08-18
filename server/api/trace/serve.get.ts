import fs from "node:fs";
import mime from "mime";

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const filePath = query.path as string;

  if (!filePath) {
    throw createError({ statusCode: 400, statusMessage: "Path is required" });
  }

  if (!fs.existsSync(filePath)) {
    throw createError({ statusCode: 404, statusMessage: "File not found" });
  }

  const stat = fs.statSync(filePath);
  const contentType = mime.getType(filePath) || "application/octet-stream";

  setHeaders(event, {
    "Content-Type": contentType,
    "Content-Length": stat.size.toString(),
    "Access-Control-Allow-Origin": "*",
  });

  return sendStream(event, fs.createReadStream(filePath));
});