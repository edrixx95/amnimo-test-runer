import path from 'node:path';
import fs from 'node:fs';
import { Session } from '../../../shared/types';
import { getSettings } from '../../../utils/settingsManager';

const SESSIONS_DIR = path.resolve(process.cwd(), 'sessions');
const getReportsDir = () => path.join(getSettings().e2ePath, 'test-results/e2e-reports');

type ReportData = {
  id: string; // The relative path to the report folder, e.g. 2026-07-15/test-AX30-A-175245
  name: string;
  createdAt: string;
  excelJsonUrl?: string;
  htmlReportUrl?: string;
  failedCount?: number;
  passedCount?: number;
  totalCount?: number;
};

export default defineEventHandler(async (event) => {
  const sessionId = getRouterParam(event, 'id');
  if (!sessionId) {
    throw createError({ statusCode: 400, statusMessage: 'Session ID is required' });
  }

  // Read session to get createdAt
  const sessionPath = path.join(SESSIONS_DIR, sessionId, 'session.json');
  if (!fs.existsSync(sessionPath)) {
    throw createError({ statusCode: 404, statusMessage: 'Session not found' });
  }

  const sessionData = await fs.promises.readFile(sessionPath, 'utf-8');
  const session: Session = JSON.parse(sessionData);
  const sessionCreatedAt = new Date(session.createdAt).getTime();
  const sessionClosedAt = session.closedAt ? new Date(session.closedAt).getTime() : Infinity;

  const results: ReportData[] = [];

  const reportsDir = getReportsDir();
  if (!fs.existsSync(reportsDir)) {
    return results; // No reports generated yet
  }

  // Scan level 1: date directories (e.g. 2026-07-15)
  const dateDirs = fs.readdirSync(reportsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory());

  for (const dateDir of dateDirs) {
    const level1Path = path.join(reportsDir, dateDir.name);
    
    // Scan level 2: test run directories (e.g. test-AX30-...)
    const runDirs = fs.readdirSync(level1Path, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && dirent.name.startsWith('test-') && (session.testType === 'playground' || (session.board ? dirent.name.includes(session.board) : true)));

    for (const runDir of runDirs) {
      const runPath = path.join(level1Path, runDir.name);
      const stat = fs.statSync(runPath);
      
      // Allow up to 10 seconds difference for creation delays
      const dirTime = Math.max(stat.mtimeMs, stat.birthtimeMs);
      
      // Include reports created between session creation and session close
      if (dirTime >= sessionCreatedAt - 10000 && dirTime <= sessionClosedAt + 60000) {
        
        const relativeRunPath = `${dateDir.name}/${runDir.name}`;
        const report: ReportData = {
          id: relativeRunPath,
          name: runDir.name,
          createdAt: new Date(dirTime).toISOString(),
        };

        // Find HTML report
        const htmlIndex = path.join(runPath, 'html-report', 'index.html');
        if (fs.existsSync(htmlIndex)) {
          report.htmlReportUrl = `/api/reports/serve/${relativeRunPath}/html-report/index.html`;
        }

        // Find Excel JSON in /all folder
        const allDir = path.join(runPath, 'all');
        if (fs.existsSync(allDir)) {
          const files = fs.readdirSync(allDir);
          const excelFile = files.find(f => f.endsWith('-excel.json'));
          if (excelFile) {
            report.excelJsonUrl = `/api/reports/serve/${relativeRunPath}/all/${excelFile}`;
            
            try {
              const excelData = fs.readFileSync(path.join(allDir, excelFile), 'utf-8');
              const data = JSON.parse(excelData);
              if (data && Array.isArray(data.categories)) {
                let passed = 0;
                let failed = 0;
                let total = 0;
                for (const cat of data.categories) {
                  if (Array.isArray(cat.pages)) {
                    for (const page of cat.pages) {
                      if (Array.isArray(page.tests)) {
                        for (const test of page.tests) {
                          total++;
                          const res = (test.result || '').toLowerCase();
                          if (res.includes('pass')) passed++;
                          else if (res.includes('fail') || res.includes('timedout')) failed++;
                        }
                      }
                    }
                  }
                }
                report.failedCount = failed;
                report.passedCount = passed;
                report.totalCount = total;
              }
            } catch(e) {
              console.error('Failed to parse excel json for counts', e);
            }
          }
        }

        if (report.htmlReportUrl || report.excelJsonUrl) {
          results.push(report);
        }
      }
    }
  }

  // Sort latest first
  results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return results;
});
