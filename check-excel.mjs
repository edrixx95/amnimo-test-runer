import fs from "fs";
import ExcelJS from "exceljs";
import path from "path";

async function run() {
  const filePath = path.resolve(process.cwd(), "shared/release-spec/リリーステスト_試験仕様書.xlsx");
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  console.log("Sheets:", workbook.worksheets.map(ws => ws.name));

  const targetSheet = workbook.worksheets.find(ws => ws.name.includes("[GUI]"));
  if (targetSheet) {
    console.log(`\nReading sheet: ${targetSheet.name}`);
    for (let i = 1; i <= 10; i++) {
      const row = targetSheet.getRow(i);
      console.log(`Row ${i}:`, row.values);
    }
  } else {
    console.log("No sheet with [GUI] found.");
  }
}

run().catch(console.error);
