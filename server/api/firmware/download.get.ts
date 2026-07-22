import fs from 'node:fs';
import path from 'node:path';
import { getSettings } from '../../utils/settingsManager';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const filename = query.filename as string;

  if (!filename) {
    throw createError({ statusCode: 400, statusMessage: 'Filename is required' });
  }

  setHeader(event, 'Content-Type', 'text/event-stream');
  setHeader(event, 'Cache-Control', 'no-cache');
  setHeader(event, 'Connection', 'keep-alive');
  
  const res = event.node.res;

  const sendEvent = (eventName: string, data: any) => {
    res.write(`event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  // Run in background
  (async () => {
    try {
      const auth = 'Basic ' + Buffer.from('amnimo:aeme2Foa9GeSeiaj').toString('base64');
      const remoteUrl = `https://tk2-221-20474.vs.sakura.ne.jp/firmware/${filename}`;
      const response = await fetch(remoteUrl, { headers: { Authorization: auth } });

      if (!response.ok) {
        throw new Error(`Remote server responded with ${response.status}`);
      }

      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;

      const uploadDir = path.join(getSettings().e2ePath, 'upload');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, filename);
      const fileStream = fs.createWriteStream(filePath);
      
      let downloaded = 0;
      let lastReportedProgress = -1;

      if (!response.body) throw new Error('No response body');
      
      const stream = response.body as unknown as AsyncIterable<Uint8Array>;
      for await (const chunk of stream) {
        fileStream.write(chunk);
        downloaded += chunk.length;
        
        if (total > 0) {
          const progress = Math.floor((downloaded / total) * 100);
          if (progress > lastReportedProgress) {
            lastReportedProgress = progress;
            sendEvent('progress', { progress, downloaded, total });
          }
        }
      }

      fileStream.end();
      sendEvent('complete', { success: true });
    } catch (err: any) {
      console.error('Download error:', err);
      sendEvent('error', { message: err.message });
    } finally {
      res.end();
    }
  })();
  
  // Keep connection open
  event._handled = true;
});
