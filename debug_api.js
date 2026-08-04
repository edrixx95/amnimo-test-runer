import fs from "node:fs";
import path from "node:path";

const sessionPath = "C:\\amnimo\\amnimo-test-runer\\sessions\\session-20260724101609-f828d4f2\\session.json";
const sessionData = fs.readFileSync(sessionPath, "utf-8");
const session = JSON.parse(sessionData);

const results = [];
const reportsDir = "C:\\amnimo\\amnimo-e2e\\test-results\\e2e-reports";
const dateDirs = fs.readdirSync(reportsDir, { withFileTypes: true }).filter(d => d.isDirectory());

for (const dateDir of dateDirs) {
  const level1Path = path.join(reportsDir, dateDir.name);
  const runDirs = fs.readdirSync(level1Path, { withFileTypes: true }).filter(d => d.isDirectory() && d.name.startsWith("test-"));

  for (const runDir of runDirs) {
    const runPath = path.join(level1Path, runDir.name);
    const stat = fs.statSync(runPath);
    const dirTime = Math.max(stat.mtimeMs, stat.birthtimeMs);
    const report = {
      id: `${dateDir.name}/${runDir.name}`,
      name: runDir.name,
      createdAt: new Date(dirTime).toISOString(),
    };
    const htmlIndex = path.join(runPath, "html-report", "index.html");
    if (fs.existsSync(htmlIndex)) {
      report.htmlReportUrl = "yes";
    }
    const allDir = path.join(runPath, "all");
    if (fs.existsSync(allDir)) {
      const files = fs.readdirSync(allDir);
      const excelFile = files.find((f) => f.endsWith("-excel.json"));
      if (excelFile) {
        report.excelJsonUrl = "yes";
      }
    }
    if (report.htmlReportUrl || report.excelJsonUrl) {
      results.push(report);
    }
  }
}

results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
console.log(results.slice(0, 5).map(r => r.name));
