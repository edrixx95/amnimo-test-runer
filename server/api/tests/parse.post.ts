import { exec } from "node:child_process";
import path from "node:path";
import fs from "node:fs/promises";
import { promisify } from "node:util";
import { getSettings } from "../../utils/settingsManager";

const execAsync = promisify(exec);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { testType, mode, tests } = body;

  const cwd = getSettings().e2ePath;
  const _isWindows = process.platform === "win32";

  // Resolve files
  let items: string[] = [];
  if (mode === "single") {
    items = tests || [];
  } else if (mode === "order") {
    const orderFile =
      tests && typeof tests === "string"
        ? tests
        : testType === "release"
          ? "AG10.json"
          : "custom.json";
    const orderFilePath = path.join(
      cwd,
      "test-order",
      testType || "release",
      orderFile,
    );
    try {
      const content = await fs.readFile(orderFilePath, "utf-8");
      items = JSON.parse(content);
    } catch (_e) {
      // Fallback
      items = [];
    }
  }

  if (items.length === 0) {
    return { suites: [] };
  }

  // Resolve to full relative paths
  const resolvedFiles = items.map((item) => {
    if (item.endsWith(".spec.ts")) {
      return item.includes("playwright/tests/release")
        ? item
        : `playwright/tests/release/${item}`;
    }
    const basename = path.basename(item);
    return `playwright/tests/release/${item}/${basename}.spec.ts`;
  });

  // Construct command
  // Setting PLAYWRIGHT_JSON_OUTPUT_NAME is needed because standard output might be cluttered
  // Actually, --reporter=json prints to stdout. Let's redirect to a temp file
  const tempFile = `temp-list-${Date.now()}.json`;
  const env = { ...process.env, PLAYWRIGHT_JSON_OUTPUT_NAME: tempFile };

  const filesArgs = resolvedFiles.map((f) => `"${f}"`).join(" ");
  const cmd = `npx playwright test ${filesArgs} --list --reporter=json`;

  try {
    // Note: playwright test --list might exit with code 0.
    await execAsync(cmd, { cwd, env, maxBuffer: 10 * 1024 * 1024 });
  } catch (_e: unknown) {
    const e = _e as import('~~/shared/types').CatchError;
    const err = e as { message?: string, statusCode?: number, statusMessage?: string };
    // If it fails (e.g. some files missing), it might still generate the json or throw
    console.error("Playwright parse error:", (err as { response?: { status?: number }, statusCode?: number, message?: string, statusMessage?: string, code?: string }).message);
  }

  let result = { config: {}, suites: [] };
  try {
    const outPath = path.join(cwd, tempFile);
    const data = await fs.readFile(outPath, "utf-8");
    result = JSON.parse(data);
    await fs.unlink(outPath); // cleanup
  } catch (e) {
    console.error("Failed to read playwright json output:", e);
  }

  return result;
});
