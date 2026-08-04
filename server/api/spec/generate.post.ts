import path from "node:path";
import fs from "node:fs/promises";
// @ts-ignore
import XlsxPopulate from "xlsx-populate";
import { getAggregatedReport } from "../../utils/reportUtils";
import { getActiveTemplatePath } from "./preview.get";

const getGeneratedDir = () => {
  const basePath = process.env.APP_DATA_PATH
    ? path.join(process.env.APP_DATA_PATH, "generated-specs")
    : path.resolve(process.cwd(), "generated-specs");
  return basePath;
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const sessionIds = body?.sessionIds || [];
  const testerName = body?.testerName || "Amnimo Test Runner";

  if (!Array.isArray(sessionIds) || sessionIds.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "No sessions selected",
    });
  }

  const generatedDir = getGeneratedDir();
  await fs.mkdir(generatedDir, { recursive: true });

  const generatedFiles = [];
  const sessionsDir = process.env.APP_DATA_PATH
    ? path.join(process.env.APP_DATA_PATH, "sessions")
    : path.resolve(process.cwd(), "sessions");
  const templatePath = await getActiveTemplatePath();

  for (const sessionId of sessionIds) {
    try {
      // 1. Get the aggregated report data
      const sessionData = await fs.readFile(
        path.join(sessionsDir, sessionId, "session.json"),
        "utf-8",
      );
      const session = JSON.parse(sessionData);

      const report = await getAggregatedReport(sessionId, session);

      // Flatten tests for easy lookup
      const testMap = new Map<string, any>();
      if (report && report.categories) {
        for (const cat of report.categories as any[]) {
          if (cat.pages) {
            for (const page of cat.pages as any[]) {
              if (page.tests) {
                for (const test of page.tests as any[]) {
                  testMap.set(test["test-id"], test);
                }
              }
            }
          }
        }
      }

      if (testMap.size === 0) {
        console.warn(`No tests found in report for session ${sessionId}`);
        continue; // Skip this session
      }

      // 2. Open the template
      const workbook = await XlsxPopulate.fromFileAsync(templatePath);

      // 3. Process sheets
      let filledCount = 0;
      let boardName = session.board || "UNKNOWN";

      for (const ws of workbook.sheets()) {
        if (ws.name().includes("【GUI】")) {
          for (let i = 2; i <= 500; i++) {
            let testIdCell = ws.cell(i, 2).value();
            if (
              testIdCell &&
              typeof testIdCell === "object" &&
              typeof testIdCell.text === "function"
            ) {
              testIdCell = testIdCell.text();
            }
            if (
              typeof testIdCell === "string" &&
              testMap.has(testIdCell.trim())
            ) {
              const testResult = testMap.get(testIdCell.trim());

              // Fill and Highlight helper
              const fillCell = (col: number, value: any, isWrap = false) => {
                const cell = ws.cell(i, col);
                cell.value(value);
                if (isWrap) cell.style("wrapText", true);
              };

              // Result: J (10)
              let resText =
                testResult.latest_result ||
                testResult.result ||
                testResult.latest_status ||
                "";
              if (resText === "Passed") resText = "Pass";
              else if (resText === "Failed") resText = "Fail";
              else if (resText === "Skipped") resText = "Skip";
              fillCell(10, resText);

              // Test GW serial: L (12)
              const model = testResult["test-device-model"] || "";
              const serial = testResult["test-device-serial"] || "";
              fillCell(12, `${model}\n${serial}`, true);

              // Tester: M (13)
              fillCell(13, testerName);

              // Date: N (14)
              fillCell(14, testResult["test-date"] || "");

              // FW: O (15)
              fillCell(15, testResult["test-fw"] || "", true);

              filledCount++;
            }
          }
        }
      }

      // Update progress sheet target board (Row 2, Col 2)
      const progressSheet = workbook.sheet("progress");
      if (progressSheet) {
        progressSheet.cell(2, 2).value(boardName);
      }

      // 4. Save the generated file
      // Format: <BOARD>_リリーステスト_試験仕様書.xlsx
      // Ensure unique filename if generating multiple of same board
      let fileName = `${boardName}_リリーステスト_試験仕様書.xlsx`;
      let outputPath = path.join(generatedDir, fileName);
      let counter = 1;

      // Simple duplicate prevention
      while (true) {
        try {
          await fs.access(outputPath);
          fileName = `${boardName}_リリーステスト_試験仕様書_${counter}.xlsx`;
          outputPath = path.join(generatedDir, fileName);
          counter++;
        } catch {
          break; // File doesn't exist, we can use it
        }
      }

      await workbook.toFileAsync(outputPath);

      generatedFiles.push({
        sessionId,
        fileName,
        path: outputPath,
        filledCount,
      });
    } catch (err: any) {
      console.error(`Failed to process session ${sessionId}:`, err);
      // We continue with other sessions instead of failing completely
    }
  }

  if (generatedFiles.length === 0) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to generate any reports",
    });
  }

  return {
    success: true,
    files: generatedFiles,
  };
});
