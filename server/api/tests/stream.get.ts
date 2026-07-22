import { getSessionProcesses } from '../../utils/processManager';
import fs from 'node:fs/promises';
import path from 'node:path';

const SESSIONS_DIR = path.resolve(process.cwd(), 'sessions');

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const sessionId = query.sessionId as string;
  
  if (!sessionId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing sessionId' });
  }

  const sessionProcs = getSessionProcesses(sessionId);
  
  setHeader(event, 'content-type', 'text/event-stream');
  setHeader(event, 'cache-control', 'no-cache');
  setHeader(event, 'connection', 'keep-alive');
  
  const eventStream = createEventStream(event);

  // Send historical logs first
  try {
    const e2eLogPath = sessionProcs.e2eLogPath || path.join(SESSIONS_DIR, sessionId, 'logs', 'e2e.log');
    const backendLogPath = sessionProcs.backendLogPath || path.join(SESSIONS_DIR, sessionId, 'logs', 'backend.log');
    
    try {
      const e2eData = await fs.readFile(e2eLogPath, 'utf-8');
      if (e2eData) {
        eventStream.push({ data: JSON.stringify({ source: 'e2e', text: e2eData }) });
      }
    } catch(e) {}
    
    try {
      const backendData = await fs.readFile(backendLogPath, 'utf-8');
      if (backendData) {
        eventStream.push({ data: JSON.stringify({ source: 'backend', text: backendData }) });
      }
    } catch(e) {}
  } catch (err) {
    console.error('Failed to read historical logs', err);
  }

  // Then listen for new logs
  const onE2eLog = (log: string) => {
    eventStream.push({
      data: JSON.stringify({ source: 'e2e', text: log })
    });
  };
  
  const onBackendLog = (log: string) => {
    eventStream.push({
      data: JSON.stringify({ source: 'backend', text: log })
    });
  };

  const onStatusUpdate = (status: string) => {
    eventStream.push({
      data: JSON.stringify({ source: 'system', status })
    });
  };

  sessionProcs.events.on('e2e-log', onE2eLog);
  sessionProcs.events.on('backend-log', onBackendLog);
  sessionProcs.events.on('status-update', onStatusUpdate);

  eventStream.onClosed(async () => {
    sessionProcs.events.off('e2e-log', onE2eLog);
    sessionProcs.events.off('backend-log', onBackendLog);
    sessionProcs.events.off('status-update', onStatusUpdate);
    await eventStream.close();
  });

  return eventStream.send();
});
