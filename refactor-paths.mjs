import fs from 'fs';
import path from 'path';

const files = [
  { file: 'server/api/firmware/copy-from-server.post.ts', depth: 2 },
  { file: 'server/api/firmware/copy.post.ts', depth: 2 },
  { file: 'server/api/firmware/download.get.ts', depth: 2 },
  { file: 'server/api/firmware/server-status.post.ts', depth: 2 },
  { file: 'server/api/firmware/status.get.ts', depth: 2 },
  { file: 'server/api/firmware/upload.post.ts', depth: 2 },
  { file: 'server/api/reports/delete.post.ts', depth: 2 },
  { file: 'server/api/reports/serve/[...path].get.ts', depth: 2 },
  { file: 'server/api/sessions/[id].put.ts', depth: 2 },
  { file: 'server/api/sessions/[id]/aggregated-report.get.ts', depth: 3 },
  { file: 'server/api/sessions/[id]/reports.get.ts', depth: 3 },
  { file: 'server/api/tests/cases.get.ts', depth: 2 },
  { file: 'server/api/tests/files.get.ts', depth: 2 },
  { file: 'server/api/tests/orders.get.ts', depth: 2 },
  { file: 'server/api/tests/parse.post.ts', depth: 2 },
  { file: 'server/api/tests/report.post.ts', depth: 2 },
  { file: 'server/api/tests/run.post.ts', depth: 2 },
  { file: 'server/utils/reportUtils.ts', depth: 1 },
  { file: 'server/utils/sessionManager.ts', depth: 1 }
];

for (const item of files) {
  const filePath = path.resolve(process.cwd(), item.file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Create relative import path to utils/settingsManager
  let importPath = '';
  if (item.depth === 1) importPath = './settingsManager';
  else if (item.depth === 2) importPath = '../../utils/settingsManager';
  else if (item.depth === 3) importPath = '../../../utils/settingsManager';
  
  const importStatement = `import { getSettings } from '${importPath}';`;
  
  // Add import if not present
  if (!content.includes('getSettings')) {
    // Find the first line after imports, or just add at top if we can't find imports easily
    if (content.startsWith('import')) {
      // split and insert after the last import block
      const lines = content.split('\n');
      const lastImportIdx = lines.findLastIndex(l => l.startsWith('import'));
      lines.splice(lastImportIdx + 1, 0, importStatement);
      content = lines.join('\n');
    } else {
      content = importStatement + '\n\n' + content;
    }
  }

  // Replace hardcoded paths
  content = content.replace(/path\.resolve\(process\.cwd\(\),\s*['"]\.\.\/amnimo-e2e['"]\)/g, "getSettings().e2ePath");
  content = content.replace(/path\.resolve\(process\.cwd\(\),\s*['"]\.\.\/amnimo-e2e\/test-results\/e2e-reports['"]\)/g, "path.join(getSettings().e2ePath, 'test-results/e2e-reports')");
  content = content.replace(/path\.resolve\(process\.cwd\(\),\s*['"]\.\.\/amnimo-e2e\/\.env['"]\)/g, "path.join(getSettings().e2ePath, '.env')");
  content = content.replace(/path\.resolve\(process\.cwd\(\),\s*`\.\.\/amnimo-e2e\/test-order\/\$\{type\}`\)/g, "path.join(getSettings().e2ePath, `test-order/${type}`)");
  content = content.replace(/path\.resolve\(process\.cwd\(\),\s*['"]\.\.['"],\s*['"]amnimo-e2e['"],\s*['"]upload['"]\)/g, "path.join(getSettings().e2ePath, 'upload')");

  // Write back
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${item.file}`);
}
