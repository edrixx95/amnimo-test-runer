import { spawn } from "node:child_process";
import _path from "node:path";
import { getSettings } from "../../utils/settingsManager";

export default defineEventHandler(async (_event) => {
  const cwd = getSettings().e2ePath;
  const isWindows = process.platform === "win32";
  const npmCmd = isWindows ? "npm.cmd" : "npm";

  // Start the playwright report server in the background
  const reportProc = spawn(npmCmd, ["run", "show-report"], {
    cwd,
    shell: isWindows,
    detached: true,
    stdio: "ignore",
  });
  reportProc.unref(); // Don't let it block the parent process from exiting

  return { success: true, message: "Report server starting" };
});
