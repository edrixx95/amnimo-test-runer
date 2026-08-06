/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-ts-comment */
import { defineEventHandler, readBody, createError } from "h3";
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
  const apiUrl = new URL("/api/device/information", targetUrl).toString();
  const authUrl = new URL("/api/auth", targetUrl).toString();

  const originalTlsConfig = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  try {
    let authHeaders: Record<string, string> = {
      Accept: "application/json",
    };

    if (username && password) {
      try {
        const authRes = await $fetch.raw(authUrl, {
          method: "POST",
          body: { username, password },
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        });

        const setCookie = authRes.headers.get("set-cookie");
        if (setCookie) {
          authHeaders["Cookie"] = setCookie;
        }

        const authData: any = authRes._data;
        if (authData && authData.token) {
          authHeaders["Authorization"] = `Bearer ${authData.token}`;
        }

        if (!setCookie && !(authData && authData.token)) {
          authHeaders["Authorization"] =
            "Basic " +
            Buffer.from(`${username}:${password}`).toString("base64");
        }
      } catch (err: any) {
        if (err.status === 401) {
          throw createError({
            statusCode: 401,
            statusMessage: "Login failed: Invalid credentials",
          });
        }
        if (err.status !== 404) {
          throw err;
        }
      }
    }

    const getResponse = await $fetch<any>(apiUrl, {
      method: "GET",
      headers: authHeaders,
      timeout: 10000,
    });

    return getResponse;
  } catch (error: any) {
    console.error("Device information check error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Failed to get device information",
      message: error.message || "Failed to get device information",
      data: {
        cause: error.cause?.message || error.message,
        stack: error.stack,
      },
    });
  } finally {
    if (originalTlsConfig !== undefined) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalTlsConfig;
    } else {
      delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    }
  }
});
