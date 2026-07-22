import { sessionManager } from '../../utils/sessionManager';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event) || {};
    const session = await sessionManager.createSession(body.name);
    return session;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create session',
    });
  }
});
