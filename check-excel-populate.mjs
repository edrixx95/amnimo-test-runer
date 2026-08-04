import XlsxPopulate from "xlsx-populate";
import path from "path";

async function run() {
  const filePath = path.resolve(process.cwd(), "shared/release-spec/リリーステスト_試験仕様書.xlsx");
  const workbook = await XlsxPopulate.fromFileAsync(filePath);

  console.log("Sheets:", workbook.sheets().map(ws => ws.name()));

  const targetSheet = workbook.sheets().find(ws => ws.name().includes("【GUI】"));
  if (targetSheet) {
    console.log(`\nReading sheet: ${targetSheet.name()}`);
    // Output row 1 to 20
    for (let i = 1; i <= 20; i++) {
      const vals = [];
      for(let j = 1; j <= 20; j++) {
        vals.push(targetSheet.cell(i, j).value());
      }
      console.log(`Row ${i}:`, JSON.stringify(vals));
    }
  } else {
    console.log("No sheet with [GUI] found.");
  }
}

run().catch(console.error);
