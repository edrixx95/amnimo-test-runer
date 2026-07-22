import { defineEventHandler, readBody, createError } from 'h3';
import { z } from 'zod';

const bodySchema = z.object({
  targetUrl: z.string().url('Invalid target URL'),
  username: z.string().default('admin'),
  password: z.string().default('yoko1234'),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const result = bodySchema.safeParse(body);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid input parameters',
      data: result.error.format(),
    });
  }

  const { targetUrl, username, password } = result.data;

  try {
    // 1. Authenticate to get session cookie
    const authUrl = new URL('/api/auth', targetUrl).toString();
    const authResponse = await $fetch.raw(authUrl, {
      method: 'POST',
      body: { username, password },
      ignoreResponseError: true,
      timeout: 10000,
      rejectUnauthorized: false
    });

    if (authResponse.status !== 200 && authResponse.status !== 201) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication failed on target device',
      });
    }

    const setCookieHeader = authResponse.headers.get('set-cookie');
    const sessionId = setCookieHeader
      ? setCookieHeader.split(';')[0]
      : null;

    if (!sessionId) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Failed to extract session cookie from target device',
      });
    }

    // 2. Fetch current Nx Witness config (to get database & datetime)
    const configUrl = new URL('/api/configs/nxwitness', targetUrl).toString();
    const getConfig = await $fetch<any>(configUrl, {
      method: 'GET',
      headers: {
        Cookie: sessionId,
      },
      timeout: 10000,
      rejectUnauthorized: false
    });

    if (!getConfig?.content) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to retrieve current Nx Witness config from device',
      });
    }

    const currentDb = getConfig.content.database;
    const currentDatetime = getConfig.content.datetime;

    // Check if already enabled to avoid restarting the daemon unnecessarily
    if (getConfig.content.enabled === true) {
      console.log('[Nx Witness Setup] Already enabled, skipping PUT request to avoid restart.');
      return {
        success: true,
        message: 'Nx Witness is already enabled.',
        alreadyEnabled: true
      };
    }

    // 3. PUT new config to enable and set password
    const putResponse = await $fetch<any>(configUrl, {
      method: 'PUT',
      headers: {
        Cookie: sessionId,
        'Content-Type': 'application/json',
      },
      body: {
        enabled: true,
        port: 7001,
        password: {
          secret: false,
          value: "yoko1234"
        },
        database: currentDb,
        datetime: currentDatetime,
        "re-archive": false
      },
      timeout: 15000,
      rejectUnauthorized: false
    });

    return putResponse;

  } catch (error: any) {
    console.error('Nx Witness setup proxy error:', error);
    throw createError({
      statusCode: error.response?.status || error.statusCode || 500,
      statusMessage: error.message || error.statusMessage || 'Failed to communicate with device',
    });
  }
});
