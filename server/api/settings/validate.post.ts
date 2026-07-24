import fs from "node:fs";
import path from "node:path";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ e2ePath: string }>(event);

  if (!body?.e2ePath) {
    return { valid: false, message: "Path is required" };
  }

  const p = body.e2ePath;

  if (!fs.existsSync(p)) {
    return { valid: false, message: "Directory does not exist" };
  }

  const stat = fs.statSync(p);
  if (!stat.isDirectory()) {
    return { valid: false, message: "Path is not a directory" };
  }

  const hasPlaywrightConfig = fs.existsSync(
    path.join(p, "playwright.config.ts"),
  );
  const hasPackageJson = fs.existsSync(path.join(p, "package.json"));

  if (!hasPlaywrightConfig && !hasPackageJson) {
    return {
      valid: false,
      message:
        "Missing playwright.config.ts or package.json. This might not be the correct amnimo-e2e folder.",
    };
  }

  return { valid: true, message: "Valid amnimo-e2e directory" };
});
