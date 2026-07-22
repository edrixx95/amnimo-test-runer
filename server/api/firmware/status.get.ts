import fs from 'node:fs';
import path from 'node:path';
import { getSettings } from '../../utils/settingsManager';

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const fw1 = query.fw1 as string;
  const fw2 = query.fw2 as string;
  const serverPath = query.serverPath as string;

  const results: Record<string, { local: boolean, server: boolean }> = {};
  const uploadDir = path.join(getSettings().e2ePath, 'upload');

  const checkFile = (fw: string) => {
    if (!fw) return;
    const local = fs.existsSync(path.join(uploadDir, fw));
    let server = false;
    
    if (serverPath && fs.existsSync(serverPath)) {
      try {
        const stat = fs.statSync(serverPath);
        if (stat.isDirectory()) {
          server = fs.existsSync(path.join(serverPath, fw));
        }
      } catch {
        server = false;
      }
    }
    
    results[fw] = { local, server };
  };

  checkFile(fw1);
  checkFile(fw2);

  return results;
});
