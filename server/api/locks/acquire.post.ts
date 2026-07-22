import { lockManager } from '../../utils/lockManager';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { resource, sessionId } = body;
  
  if (!resource || !sessionId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'resource and sessionId are required'
    });
  }
  
  // Optional: wait timeout logic
  const timeoutMs = body.timeoutMs || 0;
  
  const start = Date.now();
  while (true) {
    if (lockManager.acquire(resource, sessionId)) {
      return { success: true, resource, sessionId };
    }
    
    if (timeoutMs === 0 || Date.now() - start >= timeoutMs) {
      break;
    }
    
    // Sleep a bit before polling again
    await new Promise(r => setTimeout(r, 1000));
  }
  
  // Failed to acquire lock
  const currentLock = lockManager.getLock(resource);
  throw createError({
    statusCode: 409, // Conflict
    statusMessage: `Resource ${resource} is currently locked by session ${currentLock?.sessionId}`
  });
});
