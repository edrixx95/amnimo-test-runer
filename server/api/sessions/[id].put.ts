import fs from 'node:fs/promises';
import path from 'node:path';
import type { Session } from '../../../shared/types';
import { getSettings } from '../../utils/settingsManager';

const SESSIONS_DIR = path.resolve(process.cwd(), 'sessions');

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Session ID is required' });
  }

  try {
    const sessionDir = path.join(SESSIONS_DIR, id);
    const sessionPath = path.join(sessionDir, 'session.json');
    
    // Check if session exists
    const data = await fs.readFile(sessionPath, 'utf-8');
    const session: Session = JSON.parse(data);

    // Update session with new data
    const body = await readBody(event);
    
    if (body.envContent !== undefined) {
      const matchBoard = body.envContent.match(/^BOARD=(.*)$/m);
      if (matchBoard) body.board = matchBoard[1].trim();
      
      const matchSeries = body.envContent.match(/^SERIES=(.*)$/m);
      if (matchSeries) body.series = matchSeries[1].trim();

      const matchDeviceType = body.envContent.match(/^DEVICE_TYPE=(.*)$/m);
      if (matchDeviceType) body.deviceType = matchDeviceType[1].trim();
    }

    const updatedSession: Session = {
      ...session,
      ...body,
      updatedAt: new Date().toISOString()
    };

    // Save back to file
    await fs.writeFile(
      sessionPath,
      JSON.stringify(updatedSession, null, 2),
      'utf-8'
    );
    
    // If envContent was updated, write it to the actual e2e directory
    if (body.envContent !== undefined) {
      const e2eEnvPath = path.join(getSettings().e2ePath, '.env');
      await fs.writeFile(e2eEnvPath, body.envContent, 'utf-8');
    }

    return updatedSession;
  } catch (error: any) {
    console.error('Failed to update session:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update session',
    });
  }
});
