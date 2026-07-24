 
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, preserve-caught-error */
import { exec } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { getSettings } from "../../utils/settingsManager";

const execAsync = promisify(exec);

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  let type = (query.type as string) || "release";
  if (type === "playground") {
    type = "release";
  }
  const targetPath = query.targetPath as string;

  if (!targetPath) {
    throw createError({
      statusCode: 400,
      statusMessage: "targetPath is required",
    });
  }

  const e2eDir = getSettings().e2ePath;
  const fullTargetPath = `playwright/tests/${type}/${targetPath}`;

  try {
    const isWindows = process.platform === "win32";
    // Run playwright list command on the specific target
    const cmd = isWindows
      ? `npx.cmd playwright test ${fullTargetPath} --list --reporter=json`
      : `npx playwright test ${fullTargetPath} --list --reporter=json`;

    const { stdout } = await execAsync(cmd, { cwd: e2eDir });

    const configIndex = stdout.indexOf('"config":');
    if (configIndex === -1) {
      console.error('Could not find "config": in output');
      return {};
    }

    const jsonStart = stdout.lastIndexOf("{", configIndex);
    if (jsonStart === -1) {
      return {};
    }

    let report;
    try {
      report = JSON.parse(stdout.substring(jsonStart));
    } catch (parseErr: any) {
      throw new Error(`JSON parse error: ${parseErr.message}`);
    }

    const suites = report.suites || [];
    const casesMap: Record<string, string[]> = {};

    const typePrefix = `playwright/tests/${type}/`;
    const typePrefix2 = `${type}/`;

    for (const suite of suites) {
      let relPath = suite.file;

      if (relPath.includes(typePrefix)) {
        relPath = relPath.substring(
          relPath.indexOf(typePrefix) + typePrefix.length,
        );
      } else if (relPath.includes(typePrefix2)) {
        relPath = relPath.substring(
          relPath.indexOf(typePrefix2) + typePrefix2.length,
        );
      }

      relPath = relPath.replace(/\\/g, "/");
      const cases = suite.specs ? suite.specs.map((s: any) => s.title) : [];

      casesMap[relPath] = cases;
    }

    return casesMap;
  } catch (error: any) {
    console.error("Failed to read test cases via playwright:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || String(error),
    });
  }
});
