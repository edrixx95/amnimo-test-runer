import { spawn, exec } from "node:child_process";
import path from "node:path";
import fs from "node:fs/promises";
import { promisify } from "node:util";
import {
  clearSessionProcesses,
  getSessionProcesses,
  initLogStreams,
  writeLog,
  saveProcessPids,
} from "../../utils/processManager";
import type { Session, SessionStatus } from "../../../shared/types";
import { getSettings } from "../../utils/settingsManager";

const execAsync = promisify(exec);
const SESSIONS_DIR = process.env.APP_DATA_PATH
  ? path.join(process.env.APP_DATA_PATH, "sessions")
  : path.resolve(process.cwd(), "sessions");

async function killPortOnWindows(port: string) {
  try {
    const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
    const lines = stdout.trim().split("\n");
    for (const line of lines) {
      if (line.includes("LISTENING")) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && pid !== "0") {
          await execAsync(`taskkill /F /PID ${pid}`);
          console.log(`Killed process ${pid} on port ${port}`);
        }
      }
    }
  } catch (_err) {
    // If command fails, port might not be in use. Ignore.
  }
}

async function updateSessionStatus(sessionId: string, status: SessionStatus) {
  try {
    const sessionPath = path.join(SESSIONS_DIR, sessionId, "session.json");
    const data = await fs.readFile(sessionPath, "utf-8");
    const session: Session = JSON.parse(data);
    session.status = status as SessionStatus;
    session.updatedAt = new Date().toISOString();
    await fs.writeFile(sessionPath, JSON.stringify(session, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to update session status:", err);
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { sessionId, testType, mode, tests, orderName, sessionName, queuedSpecs, sourceType } = body;
  
  const host = getRequestHost(event);
  const protocol = getRequestProtocol(event);
  const testRunnerUrl = `${protocol}://${host}`;

  if (!sessionId) {
    throw createError({ statusCode: 400, statusMessage: "Missing sessionId" });
  }

  // Clear any existing process for this session
  clearSessionProcesses(sessionId);
  const sessionProcs = getSessionProcesses(sessionId);

  // Initialize log files
  await initLogStreams(sessionId);

  // Update status to Running
  await updateSessionStatus(sessionId, "Running");

  const cwd = getSettings().e2ePath;
  const isWindows = process.platform === "win32";
  const npmCmd = isWindows ? "npm.cmd" : "npm";

  let cliPort = "8080";
  let resolvedSessionName = sessionName;
  const parsedEnv: Record<string, string> = {};

  try {
    const sessionPath = path.join(SESSIONS_DIR, sessionId, "session.json");
    const data = await fs.readFile(sessionPath, "utf-8");
    const session: Session = JSON.parse(data);
    if (!resolvedSessionName) resolvedSessionName = session.name;

    if (session.envContent) {
      session.envContent.split("\n").forEach((line) => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
          parsedEnv[match[1]!.trim()] = match[2]!.trim();
        }
      });
      // Ensure cliPort matches the user's config
      if (parsedEnv["CLI_SERVER_PORT"]) {
        cliPort = parsedEnv["CLI_SERVER_PORT"];
      }
    }

    if (queuedSpecs) {
      if (!session.meta) session.meta = {};
      session.meta.queuedSpecs = queuedSpecs;
      await fs.writeFile(sessionPath, JSON.stringify(session, null, 2), "utf-8");
    }
  } catch (_e) {
    // ignored
  }

  if (isWindows) {
    writeLog(
      sessionId,
      "backend",
      `[System] Killing any process on port ${cliPort}...\n`,
    );
    await killPortOnWindows(cliPort);
  }

  // 1. Start Backend Hono Process
  const backendProc = spawn(npmCmd, ["run", "dev"], {
    cwd,
    shell: isWindows,
    env: { ...process.env, ...parsedEnv, FORCE_COLOR: "1" },
  });
  sessionProcs.backendProcess = backendProc;

  backendProc.stdout.setEncoding("utf8");
  backendProc.stderr.setEncoding("utf8");
  backendProc.stdout.on("data", (data) => writeLog(sessionId, "backend", data));
  backendProc.stderr.on("data", (data) => writeLog(sessionId, "backend", data));
  backendProc.on("close", (code) => {
    writeLog(sessionId, "backend", `[Hono Backend] Exited with code ${code}\n`);
  });

  // 2. Start E2E Process
  let e2eArgs: string[] = [];
  const actualType = testType === "playground" ? (sourceType || "release") : (testType || "release");

  if (mode === "single") {
    const files = new Set<string>();
    const grepCases: string[] = [];

    for (const test of tests) {
      if (test.includes("::")) {
        const [file, caseName] = test.split("::");
        files.add(file);
        // Escape regex specials just in case, though mostly they are safe
        const escaped = caseName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        // Add end anchor to ensure we don't partially match another test
        grepCases.push(`(${escaped}$)`);
      } else {
        files.add(test);
      }
    }

    const scriptName = actualType === "system-test" ? "system" : actualType;
    e2eArgs = ["run", `test:${scriptName}`, "--", ...Array.from(files)];
    // We pass grep cases via env var to avoid cmd.exe quoting bugs
    if (grepCases.length > 0) {
      parsedEnv["PLAYWRIGHT_GREP"] = grepCases.join("|");
    }
  } else if (mode === "order") {
    let runOrderName = orderName;
    if (orderName && Array.isArray(tests)) {
      // User may have reordered tests, save back to JSON file
      runOrderName = orderName.replace('.json', '') + '.run.json';
      const orderFilePath = path.join(cwd, "test-order", actualType, runOrderName);
      try {
        await fs.writeFile(orderFilePath, JSON.stringify(tests, null, 2), "utf-8");
      } catch (err) {
        console.error("Failed to save reordered tests:", err);
      }
    }
    
    if (actualType === "release" || actualType === "system-test") {
      const scriptName = actualType === "system-test" ? "system" : actualType;
      e2eArgs = ["run", `test:${scriptName}`];
      if (runOrderName) {
        e2eArgs.push("--", runOrderName);
      } else if (tests && typeof tests === "string") { // fallback for old behavior
        e2eArgs.push("--", tests);
      }
    } else {
      e2eArgs = ["test"];
    }
  } else if (mode === "rerun-failed") {
    e2eArgs = ["run", "test:rerun-failed"];
    if (resolvedSessionName) {
      let finalSessionName = resolvedSessionName;
      try {
        const e2eDir = path.join(getSettings().e2ePath, "test-results", "e2e-reports");
        const dateDirs = await fs.readdir(e2eDir);
        dateDirs.sort().reverse();

        let foundExact = false;
        for (const dateDir of dateDirs) {
          const runPath = path.join(e2eDir, dateDir);
          const stat = await fs.stat(runPath).catch(() => null);
          if (stat?.isDirectory()) {
            const runs = await fs.readdir(runPath);
            if (runs.includes(resolvedSessionName)) {
              foundExact = true;
              break;
            }
          }
        }

        if (!foundExact) {
          for (const dateDir of dateDirs) {
            const runPath = path.join(e2eDir, dateDir);
            const stat = await fs.stat(runPath).catch(() => null);
            if (stat?.isDirectory()) {
              const runs = await fs.readdir(runPath);
              runs.sort().reverse();
              const matching = runs.find((d) => d.startsWith(resolvedSessionName + "-"));
              if (matching) {
                finalSessionName = matching;
                break;
              }
            }
          }
        }
      } catch (e) {
        console.log(e)
        // Ignore errors and fallback to resolvedSessionName
      }
      e2eArgs.push("--", "--session", finalSessionName);
    }
  }

  const spawnEnv: Record<string, string> = { 
    ...process.env, 
    ...parsedEnv, 
    FORCE_COLOR: "1", 
    TEST_RUNNER_URL: testRunnerUrl,
    SESSION_ID: sessionId 
  } as Record<string, string>;

  const e2eProc = spawn(npmCmd, e2eArgs, {
    cwd,
    shell: isWindows,
    env: spawnEnv,
  });
  sessionProcs.e2eProcess = e2eProc;

  // Save PIDs to file for reliable process killing across hot-reloads
  saveProcessPids(sessionId, e2eProc.pid, backendProc.pid);

  e2eProc.stdout.setEncoding("utf8");
  e2eProc.stderr.setEncoding("utf8");
  e2eProc.stdout.on("data", (data) => writeLog(sessionId, "e2e", data));
  e2eProc.stderr.on("data", (data) => writeLog(sessionId, "e2e", data));
  e2eProc.on("close", async (code) => {
    writeLog(sessionId, "e2e", `[Test Runner] Exited with code ${code}\n`);

    let finalStatus: SessionStatus = code === 0 ? "Completed" : "Failed";

    // If the process exited 0, double-check that all tests in the aggregated report passed
    if (finalStatus === "Completed") {
      try {
        const sessionPath = path.join(SESSIONS_DIR, sessionId, "session.json");
        const data = await fs.readFile(sessionPath, "utf-8");
        const session: Session = JSON.parse(data);

        const aggregated = await getAggregatedReport(sessionId, session);
        if (aggregated._meta.failed > 0) {
          finalStatus = "Failed";
        }
      } catch (err) {
        console.error("Failed to check aggregated report status:", err);
      }
    }

    // When E2E finishes, update status
    await updateSessionStatus(sessionId, finalStatus);
    // Also broadcast the state change to the frontend
    sessionProcs.events.emit("status-update", finalStatus);
  });

  return { success: true, message: "Processes started successfully" };
});
