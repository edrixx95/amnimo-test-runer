import { lockManager } from "../../utils/lockManager";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { resource, sessionId, force } = body;

  if (!resource || !sessionId) {
    throw createError({
      statusCode: 400,
      statusMessage: "resource and sessionId are required",
    });
  }

  const success = lockManager.release(resource, sessionId, force === true);

  if (!success) {
    throw createError({
      statusCode: 403, // Forbidden
      statusMessage: `Session ${sessionId} does not own the lock on resource ${resource} and force was not specified`,
    });
  }

  return { success: true, resource, sessionId };
});
