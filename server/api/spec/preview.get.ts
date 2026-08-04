import path from "node:path";
import fs from "node:fs/promises";
// @ts-ignore
import XlsxPopulate from "xlsx-populate";

export const getSpecDir = () => {
  return process.env.APP_DATA_PATH
    ? path.join(process.env.APP_DATA_PATH, "spec-manager")
    : path.resolve(process.cwd(), "spec-manager");
};

export const getActiveTemplatePath = async () => {
  const templateDir = path.join(getSpecDir(), "template");
  await fs.mkdir(templateDir, { recursive: true });
  const activePath = path.join(templateDir, "リリーステスト_試験仕様書.xlsx");

  try {
    await fs.access(activePath);
  } catch {
    const bundledPath = path.resolve(
      process.cwd(),
      "shared/release-spec/リリーステスト_試験仕様書.xlsx",
    );
    await fs.copyFile(bundledPath, activePath);
  }
  return activePath;
};

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const fileName = query.file as string;

    let targetPath;
    if (fileName) {
      const generatedDir = process.env.APP_DATA_PATH
        ? path.join(process.env.APP_DATA_PATH, "generated-specs")
        : path.resolve(process.cwd(), "generated-specs");
      targetPath = path.join(generatedDir, fileName);
      // Ensure file exists
      await fs.access(targetPath);
    } else {
      targetPath = await getActiveTemplatePath();
    }

    const workbook = await XlsxPopulate.fromFileAsync(targetPath);

    const getStr = (val: any) => {
      if (val === undefined || val === null) return "";
      if (typeof val === "object" && typeof val.text === "function")
        return val.text();
      return String(val);
    };

    // Emulate Excel calculation for the "progress" sheet so the preview shows actual numbers
    const progressSheet = workbook.sheet("progress");
    if (progressSheet) {
      const targetBoard = getStr(progressSheet.cell("B2").value());
      let sumC = 0,
        sumD = 0,
        sumE = 0,
        sumF = 0,
        sumH = 0,
        sumI = 0,
        sumJ = 0,
        sumL = 0,
        sumM = 0;

      for (let i = 4; i <= 10; i++) {
        const sheetName = getStr(progressSheet.cell(i, 2).value());
        if (!sheetName) continue;
        const targetWs = workbook.sheet(sheetName);
        if (!targetWs) continue;

        let C = 0,
          D = 0,
          E = 0,
          F = 0,
          H = 0,
          I = 0,
          J = 0,
          L = 0,
          M = 0;
        for (let r = 3; r <= 300; r++) {
          const colA = getStr(targetWs.cell(r, 1).value());
          const colB = getStr(targetWs.cell(r, 2).value());
          const colD = getStr(targetWs.cell(r, 4).value());
          const colJ = getStr(targetWs.cell(r, 10).value());
          const colQ = getStr(targetWs.cell(r, 17).value());

          const matchA = targetBoard && colA.includes(targetBoard);
          const matchB = colB !== "";
          if (matchA && matchB) {
            C++;

            const jLower = colJ.trim().toLowerCase();
            const qLower = colQ.trim().toLowerCase();

            if (jLower !== "") F++;
            if (jLower === "pass" || jLower === "at-pass") H++;
            if (jLower === "fail") {
              I++;
              L++; // 1次Fail
            }
            if (jLower === "skip") J++;
            if (qLower === "skip") M++; // 2次Skip
          }
          if (matchA) {
            if (colD === "MUST") D++;
            if (colD === "OPTION") E++;
          }
        }

        const G = C === 0 ? "0%" : Math.round((F / C) * 100) + "%";
        progressSheet.cell(i, 3).value(C);
        progressSheet.cell(i, 4).value(D);
        progressSheet.cell(i, 5).value(E);
        progressSheet.cell(i, 6).value(F);
        progressSheet.cell(i, 7).value(G);
        progressSheet.cell(i, 8).value(H);
        progressSheet.cell(i, 9).value(I);
        progressSheet.cell(i, 10).value(J);
        progressSheet.cell(i, 12).value(L);
        progressSheet.cell(i, 13).value(M);

        sumC += C;
        sumD += D;
        sumE += E;
        sumF += F;
        sumH += H;
        sumI += I;
        sumJ += J;
        sumL += L;
        sumM += M;
      }

      const sumG = sumC === 0 ? "0%" : Math.round((sumF / sumC) * 100) + "%";
      progressSheet.cell(11, 3).value(sumC);
      progressSheet.cell(11, 4).value(sumD);
      progressSheet.cell(11, 5).value(sumE);
      progressSheet.cell(11, 6).value(sumF);
      progressSheet.cell(11, 7).value(sumG);
      progressSheet.cell(11, 8).value(sumH);
      progressSheet.cell(11, 9).value(sumI);
      progressSheet.cell(11, 10).value(sumJ);
      progressSheet.cell(11, 12).value(sumL);
      progressSheet.cell(11, 13).value(sumM);
    }

    const sheets = [];
    for (const ws of workbook.sheets()) {
      const name = ws.name();
      if (name === "progress" || name.includes("【GUI】")) {
        const rows = [];
        const maxCols = name === "progress" ? 13 : 20;
        // Read first 50 rows for preview
        for (let i = 1; i <= 50; i++) {
          const rowVals = [];
          for (let j = 1; j <= maxCols; j++) {
            let val = ws.cell(i, j).value();
            const formula = ws.cell(i, j).formula();

            if (val === undefined && formula) {
              val = "ƒ(Auto-calc)";
            } else if (
              val &&
              typeof val === "object" &&
              typeof val.text === "function"
            ) {
              // Handle RichText objects
              val = val.text();
            } else if (val && typeof val === "object") {
              // Other objects (errors, formulas)
              val = val.error || val.formula || String(val);
            }

            rowVals.push({
              value: val,
            });
          }
          // Only push if the row is not completely empty
          if (
            rowVals.some(
              (v) =>
                v.value !== undefined && v.value !== null && v.value !== "",
            )
          ) {
            rows.push({ index: i, cells: rowVals });
          }
        }
        sheets.push({ name, rows });
      }
    }

    return sheets;
  } catch (error: any) {
    console.error("Failed to preview template/file", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to read file",
    });
  }
});
