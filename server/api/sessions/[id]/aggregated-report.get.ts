import path from 'node:path';
import fs from 'node:fs';
import { Session } from '../../../shared/types';
import { getSettings } from '../../../utils/settingsManager';

const SESSIONS_DIR = path.resolve(process.cwd(), 'sessions');

export default defineEventHandler(async (event) => {
  const sessionId = getRouterParam(event, 'id');
  if (!sessionId) {
    throw createError({ statusCode: 400, statusMessage: 'Session ID is required' });
  }

  const sessionPath = path.join(SESSIONS_DIR, sessionId, 'session.json');
  if (!fs.existsSync(sessionPath)) {
    throw createError({ statusCode: 404, statusMessage: 'Session not found' });
  }

  const sessionData = await fs.promises.readFile(sessionPath, 'utf-8');
  const session: Session = JSON.parse(sessionData);
  
  return getAggregatedReport(sessionId, session);
});
