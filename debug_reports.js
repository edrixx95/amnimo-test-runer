import fs from "node:fs";
import path from "node:path";

const sessionPath = "C:\\amnimo\\amnimo-test-runer\\sessions\\session-20260724101609-f828d4f2\\session.json";
const sessionData = fs.readFileSync(sessionPath, "utf-8");
const session = JSON.parse(sessionData);
const sessionCreatedAt = new Date(session.createdAt).getTime();
const sessionClosedAt = session.closedAt
  ? new Date(session.closedAt).getTime()
  : Infinity;

console.log("sessionCreatedAt:", sessionCreatedAt, new Date(sessionCreatedAt));
console.log("sessionClosedAt:", sessionClosedAt);

const reportsDir = "C:\\amnimo\\amnimo-e2e\\test-results\\e2e-reports";
const level1Path = path.join(reportsDir, "2026-07-29");
const runDirs = fs.readdirSync(level1Path, { withFileTypes: true });

for (const runDir of runDirs) {
  if (runDir.name === "test-AX30-A-184945" || runDir.name === "test-AX30-A-152430") {
    const runPath = path.join(level1Path, runDir.name);
    const stat = fs.statSync(runPath);
    const dirTime = Math.max(stat.mtimeMs, stat.birthtimeMs);
    console.log("Folder:", runDir.name);
    console.log("dirTime:", dirTime, new Date(dirTime));
    console.log("birthtimeMs:", stat.birthtimeMs);
    console.log("mtimeMs:", stat.mtimeMs);
    
    if (dirTime >= sessionCreatedAt - 10000 && dirTime <= sessionClosedAt + 60000) {
      console.log("  => INCLUDE");
    } else {
      console.log("  => EXCLUDE");
    }
  }
}
