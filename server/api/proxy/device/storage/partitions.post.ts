import { z } from "zod";

const bodySchema = z.object({
  targetUrl: z.string().url("Invalid target URL"),
  username: z.string().default("admin"),
  password: z.string().default("yoko1234"),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const result = bodySchema.safeParse(body);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid input parameters",
      data: result.error.format(),
    });
  }

  const { targetUrl, username, password } = result.data;

  try {
    // 1. Authenticate to get session cookie
    const authUrl = new URL("/api/auth", targetUrl).toString();
    const authResponse = await $fetch.raw(authUrl, {
      method: "POST",
      body: { username, password },
      ignoreResponseError: true,
      timeout: 10000,
    });

    if (authResponse.status !== 200 && authResponse.status !== 201) {
      throw createError({
        statusCode: 401,
        statusMessage: "Authentication failed on target device",
      });
    }

    const setCookieHeader = authResponse.headers.get("set-cookie");
    const sessionId = setCookieHeader ? setCookieHeader.split(";")[0] : null;

    if (!sessionId) {
      throw createError({
        statusCode: 401,
        statusMessage: "Failed to extract session cookie from target device",
      });
    }

    // 2. Fetch storage partitions
    const storageUrl = new URL(
      "/api/device/storage/partitions",
      targetUrl,
    ).toString();
    const storageResponse = await $fetch(storageUrl, {
      method: "GET",
      headers: {
        Cookie: sessionId,
      },
      timeout: 10000,
    });

    return storageResponse;
  } catch (_e: unknown) {
    const e = _e as import('~~/shared/types').CatchError;
    const error = e as { response?: { status?: number }, statusCode?: number, message?: string, statusMessage?: string };
    console.error("Storage check proxy error:", _e);
    
    // Extract actual message if possible
    let errorMsg = "Failed to communicate with device";
    if (error && error.message) {
      errorMsg = error.message;
    } else if (error && error.statusMessage) {
      errorMsg = error.statusMessage;
    } else if (_e instanceof Error) {
      errorMsg = _e.message;
    }

    throw createError({
      statusCode: (error as any)?.statusCode || 500,
      statusMessage: errorMsg,
      message: errorMsg,
    });
  }
});
