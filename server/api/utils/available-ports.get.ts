import { getAvailablePort } from "../../utils/portFinder";

export default defineEventHandler(async (_event) => {
  const ports: number[] = [];
  let currentStart = 8080;

  try {
    for (let i = 0; i < 10; i++) {
      const port = await getAvailablePort(currentStart);
      ports.push(port);
      currentStart = port + 1;
    }
    return ports;
  } catch (_e: unknown) {
    const e = _e as import('~~/shared/types').CatchError;
    const error = e as { message?: string, statusCode?: number, statusMessage?: string };
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to find available ports",
      data: (error as { response?: { status?: number }, statusCode?: number, message?: string, statusMessage?: string, code?: string }).message,
    });
  }
});
