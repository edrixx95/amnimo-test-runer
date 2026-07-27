import { execSync } from "node:child_process";
import type { ChildProcess } from "node:child_process";
import EventEmitter from "node:events";
import fs from "node:fs";
import path from "node:path";
import fsPromises from "node:fs/promises";
import { lockManager } from "./lockManager";


type TestSessionProcesses = {
  e2eProcess?: ChildProcess;
  backendProcess?: ChildProcess;
  events: EventEmitter; // Used to broadcast logs to SSE streams
  e2eLogStream?: fs.WriteStream;
  backendLogStream?: fs.WriteStream;
  e2eLogPath?: string;
  backendLogPath?: string;
};

const processMap = new Map<string, TestSessionProcesses>();
const SESSIONS_DIR = process.env.APP_DATA_PATH
  ? path.join(process.env.APP_DATA_PATH, "sessions")
  : path.resolve(process.cwd(), "sessions");

export const getSessionProcesses = (sessionId: string) => {
  if (!processMap.has(sessionId)) {
    processMap.set(sessionId, {
      events: new EventEmitter(),
    });
  }
  return processMap.get(sessionId)!;
};

export const initLogStreams = async (sessionId: string) => {
  const sessionProcs = getSessionProcesses(sessionId);
  const logsDir = path.join(SESSIONS_DIR, sessionId, "logs");

  await fsPromises.mkdir(logsDir, { recursive: true });

  if (sessionProcs.e2eLogStream) sessionProcs.e2eLogStream.end();
  if (sessionProcs.backendLogStream) sessionProcs.backendLogStream.end();

  // Create new timestamped logs
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const e2eLogPath = path.join(logsDir, `e2e-${timestamp}.log`);
  const backendLogPath = path.join(logsDir, `backend-${timestamp}.log`);

  sessionProcs.e2eLogPath = e2eLogPath;
  sessionProcs.backendLogPath = backendLogPath;

  sessionProcs.e2eLogStream = fs.createWriteStream(e2eLogPath, { flags: "w" });
  sessionProcs.backendLogStream = fs.createWriteStream(backendLogPath, {
    flags: "w",
  });
};

export const writeLog = (
  sessionId: string,
  source: "e2e" | "backend",
  data: string | Buffer,
) => {
  const sessionProcs = getSessionProcesses(sessionId);

  if (source === "e2e" && sessionProcs.e2eLogStream) {
    sessionProcs.e2eLogStream.write(data);
  } else if (source === "backend" && sessionProcs.backendLogStream) {
    sessionProcs.backendLogStream.write(data);
  }

  sessionProcs.events.emit(`${source}-log`, data.toString());
};

export const clearSessionProcesses = (sessionId: string) => {
  const session = processMap.get(sessionId);
  if (session) {
    if (
      session.e2eProcess &&
      !session.e2eProcess.killed &&
      session.e2eProcess.pid
    ) {
      if (process.platform === "win32") {
        try {
          execSync(`taskkill /pid ${session.e2eProcess.pid} /t /f`);
        } catch (e) {
          console.error("Failed to kill e2e process tree", e);
        }
      } else {
        session.e2eProcess.kill("SIGKILL");
      }
    }
    if (
      session.backendProcess &&
      !session.backendProcess.killed &&
      session.backendProcess.pid
    ) {
      if (process.platform === "win32") {
        try {
          execSync(`taskkill /pid ${session.backendProcess.pid} /t /f`);
        } catch (e) {
          console.error("Failed to kill backend process tree", e);
        }
      } else {
        session.backendProcess.kill("SIGKILL");
      }
    }
    if (session.e2eLogStream) session.e2eLogStream.end();
    if (session.backendLogStream) session.backendLogStream.end();

    session.e2eProcess = undefined;
    session.backendProcess = undefined;
    session.e2eLogStream = undefined;
    session.backendLogStream = undefined;
    lockManager.releaseAllForSession(sessionId);
  }
};

export const saveProcessPids = async (
  sessionId: string,
  e2ePid?: number,
  backendPid?: number,
) => {
  try {
    const pidPath = path.join(SESSIONS_DIR, sessionId, "pids.json");
    await fsPromises.writeFile(
      pidPath,
      JSON.stringify({ e2ePid, backendPid }),
      "utf-8",
    );
  } catch (err) {
    console.error("Failed to save PIDs", err);
  }
};

export const killProcessesByFile = async (sessionId: string) => {
  try {
    const pidPath = path.join(SESSIONS_DIR, sessionId, "pids.json");
    if (fs.existsSync(pidPath)) {
      const data = await fsPromises.readFile(pidPath, "utf-8");
      const { e2ePid, backendPid } = JSON.parse(data);

      if (process.platform === "win32") {
        if (e2ePid) {
          try {
            execSync(`taskkill /pid ${e2ePid} /t /f`);
          } catch (_e) { /* ignore */ }
        }
        if (backendPid) {
          try {
            execSync(`taskkill /pid ${backendPid} /t /f`);
          } catch (_e) { /* ignore */ }
        }
      } else {
        if (e2ePid) {
          try {
            process.kill(e2ePid, "SIGKILL");
          } catch (_e) { /* ignore */ }
        }
        if (backendPid) {
          try {
            process.kill(backendPid, "SIGKILL");
          } catch (_e) { /* ignore */ }
        }
      }

      await fsPromises.rm(pidPath, { force: true });
      lockManager.releaseAllForSession(sessionId);
    }
  } catch (err) {
    console.error("Failed to kill processes by file", err);
  }
};
