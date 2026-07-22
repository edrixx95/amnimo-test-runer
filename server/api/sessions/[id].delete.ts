import fs from 'node:fs/promises';
import path from 'node:path';

const SESSIONS_DIR = path.resolve(process.cwd(), 'sessions');

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Session ID is required' });
  }

  try {
    const sessionDir = path.join(SESSIONS_DIR, id);
    // Remove the session directory and its contents
    await fs.rm(sessionDir, { recursive: true, force: true });
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete session:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete session',
    });
  }
});
