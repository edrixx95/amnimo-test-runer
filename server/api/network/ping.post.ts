import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const ip = body?.ip || '192.168.0.254';

  try {
    // Only basic ping on Windows (assuming Windows since the runtime is Windows)
    // -n 1 means 1 packet, -w 1000 means 1000ms timeout
    const { stdout } = await execAsync(`ping -n 1 -w 1000 ${ip}`);
    
    // Check if output contains TTL (which means success)
    if (stdout.toLowerCase().includes('ttl=')) {
      return { success: true, message: 'Ping successful' };
    }
    
    return { success: false, message: 'Ping failed: Host unreachable' };
  } catch (error: any) {
    console.error('Ping error:', error.message);
    return { success: false, message: 'Ping failed or timeout' };
  }
});
