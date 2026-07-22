import path from 'node:path';
import fs from 'node:fs';
import { getSettings } from '../../utils/settingsManager';

const getReportsDir = () => path.join(getSettings().e2ePath, 'test-results/e2e-reports');

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { reportId } = body;

  if (!reportId || typeof reportId !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'reportId is required' });
  }

  // Prevent directory traversal attacks
  if (reportId.includes('..') || path.isAbsolute(reportId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid reportId format' });
  }

  const reportsDir = getReportsDir();
  const targetDir = path.join(reportsDir, reportId);

  // Ensure the target directory is inside REPORTS_DIR
  if (!targetDir.startsWith(reportsDir)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
  }

  if (fs.existsSync(targetDir)) {
    try {
      await fs.promises.rm(targetDir, { recursive: true, force: true });
      return { success: true };
    } catch (e: any) {
      console.error('Failed to delete report:', e);
      throw createError({ statusCode: 500, statusMessage: 'Failed to delete report' });
    }
  } else {
    throw createError({ statusCode: 404, statusMessage: 'Report not found' });
  }
});
