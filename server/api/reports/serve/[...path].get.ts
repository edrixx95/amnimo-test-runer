import path from "node:path";
import fs from "node:fs";
import { sendStream, setHeader, createError } from "h3";
import { getSettings } from "../../../utils/settingsManager";

const getReportsDir = () =>
  path.join(getSettings().e2ePath, "test-results/e2e-reports");

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".zip": "application/zip",
};

export default defineEventHandler((event) => {
  const params = getRouterParams(event);
  const filePath = params.path;

  if (!filePath) {
    throw createError({ statusCode: 400, statusMessage: "Path is required" });
  }

  // Prevent directory traversal
  const normalizedPath = path.normalize(filePath);
  if (normalizedPath.includes("..") || path.isAbsolute(normalizedPath)) {
    throw createError({ statusCode: 403, statusMessage: "Forbidden path" });
  }

  const reportsDir = getReportsDir();
  const absolutePath = path.join(reportsDir, normalizedPath);

  if (!fs.existsSync(absolutePath)) {
    throw createError({ statusCode: 404, statusMessage: "File not found" });
  }

  const stat = fs.statSync(absolutePath);
  if (!stat.isFile()) {
    throw createError({ statusCode: 400, statusMessage: "Not a file" });
  }

  const ext = path.extname(absolutePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  setHeader(event, "Content-Type", contentType);
  setHeader(event, "Content-Length", stat.size);

  const stream = fs.createReadStream(absolutePath);
  return sendStream(event, stream);
});
