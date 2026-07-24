import path from "node:path";
import fs from "node:fs";
import type { Session } from "../../shared/types";
import { getSettings } from "./settingsManager";

const SESSIONS_DIR = process.env.APP_DATA_PATH
  ? path.join(process.env.APP_DATA_PATH, "sessions")
  : path.resolve(process.cwd(), "sessions");
const getReportsDir = () =>
  path.join(getSettings().e2ePath, "test-results/e2e-reports");

export const getAggregatedReport = async (
  sessionId: string,
  session: Session,
) => {
  const sessionCreatedAt = new Date(session.createdAt).getTime();
  const sessionClosedAt = session.closedAt
    ? new Date(session.closedAt).getTime()
    : Infinity;

  // 1. Gather all run directories for this session
  const runDirsList: { path: string; relativePath: string; time: number }[] =
    [];
  const reportsDir = getReportsDir();

  if (fs.existsSync(reportsDir)) {
    const dateDirs = fs
      .readdirSync(reportsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory());
    for (const dateDir of dateDirs) {
      const level1Path = path.join(reportsDir, dateDir.name);
      let expectedPrefix = "test-";
      if (session.board && session.testType !== "playground") {
        let dt = session.deviceType;
        if (session.board === "AR10" && session.deviceType === "Normal") {
          dt = "";
        }
        expectedPrefix = dt
          ? `test-${session.board}-${dt}-`
          : `test-${session.board}-`;
      }

      const runDirs = fs
        .readdirSync(level1Path, { withFileTypes: true })
        .filter((d) => {
          if (!d.isDirectory()) return false;
          if (!d.name.startsWith(expectedPrefix)) return false;

          // Prevent partial match like test-AG10 matching test-AG10-pppoe
          if (session.board && session.testType !== "playground") {
            const rest = d.name.slice(expectedPrefix.length);
            if (!/^\d{6}/.test(rest)) return false;
          }

          return true;
        });
      for (const runDir of runDirs) {
        const runPath = path.join(level1Path, runDir.name);
        const stat = fs.statSync(runPath);
        const dirTime = Math.max(stat.mtimeMs, stat.birthtimeMs);
        if (
          dirTime >= sessionCreatedAt - 10000 &&
          dirTime <= sessionClosedAt + 60000
        ) {
          runDirsList.push({
            path: runPath,
            relativePath: `${dateDir.name}/${runDir.name}`,
            time: dirTime,
          });
        }
      }
    }
  }

  // Sort chronologically (oldest first)
  runDirsList.sort((a, b) => a.time - b.time);

  // 2. Aggregate excel.json files
  const testMap = new Map<string, any>(); // key -> aggregated test object

  let rerunCounter = 0;

  for (let i = 0; i < runDirsList.length; i++) {
    const run = runDirsList[i]!;
    const allDir = path.join(run.path, "all");
    if (!fs.existsSync(allDir)) continue;

    const files = fs.readdirSync(allDir);
    const excelFile = files.find((f) => f.endsWith("-excel.json"));
    if (!excelFile) continue;

    const htmlIndex = path.join(run.path, "html-report", "index.html");
    const hasHtml = fs.existsSync(htmlIndex);
    const htmlReportUrl = hasHtml
      ? `/api/reports/serve/${run.relativePath}/html-report/index.html`
      : null;

    const isRerun = run.relativePath.toLowerCase().includes("rerun");
    let runTypeLabel = "";
    if (isRerun) {
      rerunCounter++;
      runTypeLabel = `Rerun-${rerunCounter}`;
    }

    try {
      const excelData = fs.readFileSync(path.join(allDir, excelFile), "utf-8");
      const data = JSON.parse(excelData);

      if (data && Array.isArray(data.categories)) {
        for (const cat of data.categories) {
          if (Array.isArray(cat.pages)) {
            for (const page of cat.pages) {
              if (Array.isArray(page.tests)) {
                for (const test of page.tests) {
                  const testId = test["test-id"] || "-";
                  const testModel = test["test-device-model"] || "Unknown";
                  // Use category + page + testId + model as unique key to separate test results across boards
                  const key = `${cat.category}|${page.page}|${testId}|${testModel}`;

                  let existing = testMap.get(key);
                  if (!existing) {
                    existing = {
                      category: cat.category,
                      page: page.page,
                      testId: testId,
                      model: testModel,
                      serial: test["test-device-serial"],
                      date: test["test-date"],
                      fw: test["test-fw"],
                      history: [], // Array of { label, result, htmlReportUrl }
                    };
                    testMap.set(key, existing);
                  }

                  // Update latest meta (model, date, etc.)
                  existing.model = test["test-device-model"];
                  existing.serial = test["test-device-serial"];
                  existing.date = test["test-date"];
                  existing.fw = test["test-fw"];

                  const rawResult = test.result || "-";
                  let status = "Failed";
                  if (rawResult.toLowerCase().includes("pass"))
                    status = "Passed";
                  else if (rawResult.toLowerCase().includes("skip"))
                    status = "Skipped";

                  const pwTestId = test["playwright-test-id"] || "";
                  const specificHtmlReportUrl =
                    hasHtml && pwTestId
                      ? `${htmlReportUrl}#?testId=${pwTestId}`
                      : htmlReportUrl;

                  existing.history.push({
                    label: runTypeLabel,
                    result: rawResult,
                    status: status,
                    htmlReportUrl: specificHtmlReportUrl,
                  });
                }
              }
            }
          }
        }
      }
    } catch (e) {
      console.error("Failed to parse excel file for aggregation", e);
    }
  }

  // 3. Rebuild aggregated excel.json format
  const aggregatedCategories = new Map<string, Map<string, any[]>>();

  let passedCount = 0;
  let failedCount = 0;
  let skippedCount = 0;
  let totalCount = 0;

  for (const test of testMap.values()) {
    const pages =
      aggregatedCategories.get(test.category) ?? new Map<string, any[]>();
    const tests = pages.get(test.page) ?? [];

    // Convert to ExcelTest format but with history array
    tests.push({
      "test-id": test.testId,
      "test-device-model": test.model,
      "test-device-serial": test.serial,
      "test-date": test.date,
      "test-fw": test.fw,
      history: test.history,
      latest_result:
        test.history.length > 0
          ? test.history[test.history.length - 1].result
          : "-",
      latest_status:
        test.history.length > 0
          ? test.history[test.history.length - 1].status
          : "Failed",
    });

    pages.set(test.page, tests);
    aggregatedCategories.set(test.category, pages);

    // Compute stats based on latest status
    totalCount++;
    const latestStatus =
      test.history.length > 0
        ? test.history[test.history.length - 1].status
        : "Failed";
    if (latestStatus === "Passed") passedCount++;
    else if (latestStatus === "Failed") failedCount++;
    else skippedCount++;
  }

  const finalCategories = [];
  for (const [catName, pagesMap] of aggregatedCategories.entries()) {
    const pagesList = [];
    for (const [pageName, tests] of pagesMap.entries()) {
      pagesList.push({
        page: pageName,
        tests: tests,
      });
    }
    finalCategories.push({
      category: catName,
      pages: pagesList,
    });
  }

  return {
    categories: finalCategories,
    // Add meta stats for any future use, but keep structure compatible with excel.json
    _meta: {
      failed: failedCount,
      testCounts: {
        passed: passedCount,
        failed: failedCount,
        skipped: skippedCount,
      },
      specCounts: {
        completed: 0, // Not explicitly tracked in excel.json, but could be derived
        total: 0,
      },
    },
  };
};
