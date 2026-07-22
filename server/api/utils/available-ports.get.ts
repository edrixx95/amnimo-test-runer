import { getAvailablePort } from '../../utils/portFinder';

export default defineEventHandler(async (event) => {
  const ports: number[] = [];
  let currentStart = 8080;

  try {
    for (let i = 0; i < 10; i++) {
      const port = await getAvailablePort(currentStart);
      ports.push(port);
      currentStart = port + 1;
    }
    return ports;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to find available ports',
      data: error.message
    });
  }
});
