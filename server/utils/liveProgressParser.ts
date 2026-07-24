import fs from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";
import type { SessionMeta } from "../../shared/types";

const SESSIONS_DIR = process.env.APP_DATA_PATH
  ? path.join(process.env.APP_DATA_PATH, "sessions")
  : path.resolve(process.cwd(), "sessions");

export const getLiveProgress = async (
  sessionId: string,
): Promise<SessionMeta | null> => {
  const logsDir = path.join(SESSIONS_DIR, sessionId, "logs");

  if (!existsSync(logsDir)) {
    return null;
  }

  // Find the latest e2e log file
  const files = await fs.readdir(logsDir);
  const e2eLogs = files
    .filter((f) => f.startsWith("e2e") && f.endsWith(".log"))
    .sort()
    .reverse();

  if (e2eLogs.length === 0) {
    return null;
  }

  const e2eLogPath = path.join(logsDir, e2eLogs[0]!);

  try {
    const logs = await fs.readFile(e2eLogPath, "utf-8");
    const lines = logs.split("\n");

    type InnerTest = {
      name: string;
      status: "running" | "PASSED" | "FAILED" | "SKIPPED";
    };
    type Spec = {
      path: string;
      status: "waiting" | "running" | "passed" | "failed";
      innerTests: InnerTest[];
    };

    const queuedSpecs: Spec[] = [];
    let parsingHeader = false;

    for (const line of lines) {
      const cleanLine = line
        .replace(/\x1B(?:\[[0-9;]*[a-zA-Z]|\].*?\x07|\].*?\x1B\\)/g, "")
        .trim();

      if (
        cleanLine === "--- Executing Playwright Tests in Order ---" ||
        cleanLine.startsWith("Failed tests to rerun:")
      ) {
        parsingHeader = true;
        queuedSpecs.length = 0; // Clear array
        continue;
      }

      if (
        cleanLine.startsWith("-------------------------------------------") ||
        (parsingHeader && cleanLine === "")
      ) {
        parsingHeader = false;
        continue;
      }

      if (parsingHeader) {
        const match = cleanLine.match(/^(\d+)\.\s+(.*\.spec\.ts)$/);
        if (match) {
          queuedSpecs.push({
            path: match[2]!,
            status: "waiting",
            innerTests: [],
          });
          continue;
        }

        const matchRerun = cleanLine.match(
          /-\s+\w+:\s+.*\((.*\.spec\.ts):\d+\)/,
        );
        if (matchRerun) {
          const specPath = matchRerun[1]!;
          if (!queuedSpecs.find((s) => s.path === specPath)) {
            queuedSpecs.push({
              path: specPath,
              status: "waiting",
              innerTests: [],
            });
          }
          continue;
        }
      }

      const execMatch = cleanLine.match(
        /^\[(\d+)\/(\d+)\] Executing:\s+(.*?\.spec\.ts)(?::\d+)?$/,
      );
      if (execMatch) {
        const index = parseInt(execMatch[1]!) - 1;
        if (queuedSpecs[index]) {
          queuedSpecs[index].status = "running";
        } else {
          queuedSpecs.push({
            path: execMatch[3]!,
            status: "running",
            innerTests: [],
          });
        }
        continue;
      }

      const testStartMatch = cleanLine.match(
        /^\[.*?\] TEST START (.*?):\s+(.*)$/,
      );
      if (testStartMatch) {
        const activeSpec = queuedSpecs.find((s) => s.status === "running");
        if (activeSpec) {
          const testName = testStartMatch[2]!.trim();
          const existing = activeSpec.innerTests.find(
            (t) => t.name === testName,
          );
          if (existing) {
            existing.status = "running";
          } else {
            activeSpec.innerTests.push({
              name: testName,
              status: "running",
            });
          }
        }
        continue;
      }

      const testEndMatch = cleanLine.match(
        /^\[.*?\] TEST END status=(.*?)\s+duration=(.*)$/,
      );
      if (testEndMatch) {
        const activeSpec = queuedSpecs.find((s) => s.status === "running");
        if (activeSpec && activeSpec.innerTests.length > 0) {
          const runningTest = activeSpec.innerTests
            .slice()
            .reverse()
            .find((t) => t.status === "running");
          if (runningTest) {
            runningTest.status = testEndMatch[1]!.trim() as any;
          }
        }
        continue;
      }

      const runFinishedMatch = cleanLine.match(
        /^\[.*?\] Run finished: status=(.*?)\s+/,
      );
      if (runFinishedMatch) {
        const activeSpec = queuedSpecs.find((s) => s.status === "running");
        if (activeSpec) {
          activeSpec.status =
            runFinishedMatch[1]!.trim() === "PASSED" ? "passed" : "failed";
        }
      }
    }

    let passed = 0;
    let failed = 0;
    let skipped = 0;

    for (const spec of queuedSpecs) {
      for (const test of spec.innerTests) {
        if (test.status === "PASSED") passed++;
        else if (test.status === "FAILED") failed++;
        else if (test.status === "SKIPPED") skipped++;
      }
    }

    const completedSpecs = queuedSpecs.filter(
      (s) => s.status === "passed" || s.status === "failed",
    ).length;

    return {
      testCounts: { passed, failed, skipped },
      specCounts: { completed: completedSpecs, total: queuedSpecs.length },
    };
  } catch (err) {
    console.error(`Failed to parse live progress for ${sessionId}:`, err);
    return null;
  }
};
