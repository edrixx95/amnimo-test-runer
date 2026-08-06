/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-ts-comment */
import { defineEventHandler, readBody, createError } from "h3";
import { z } from "zod";

const bodySchema = z.object({
  targetUrl: z.string().url("Invalid target URL"),
  defaultPassword: z.string().default("yoko1234"),
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

  const { targetUrl, defaultPassword } = result.data;
  const apiUrl = new URL("/api/on_first_startup", targetUrl).toString();

  const originalTlsConfig = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  try {
    // 1. Check startup state
    const getResponse = await $fetch<any>(apiUrl, {
      method: "GET",
      timeout: 10000,
    });

    const messages = getResponse?.result?.messages || [];
    const needsSetup = messages.some((m: any) => m.code === "E210");

    if (needsSetup) {
      // 2. Register password
      const postResponse = await $fetch<any>(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { password: defaultPassword },
        timeout: 15000,
      });

      return {
        initialized: true,
        actionTaken: "password_set",
        message:
          "Device was uninitialized. Admin password has been set automatically.",
        detail: postResponse,
      };
    } else {
      return {
        initialized: true,
        actionTaken: "none",
        message: "Device is already initialized.",
      };
    }
  } catch (error: any) {
    console.error("Startup check error:", error);
    // If it's a 404 or 401, it might mean the device is already fully initialized and the endpoint is protected/gone.
    // We treat errors (like 401/404) as "already setup" unless it's a hard timeout/network error.
    if (
      error.statusCode === 401 ||
      error.statusCode === 404 ||
      error.statusCode === 403
    ) {
      return {
        initialized: true,
        actionTaken: "none",
        message: "Device is likely initialized (endpoint blocked).",
      };
    }

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || "Failed to check device startup state",
    });
  } finally {
    if (originalTlsConfig !== undefined) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalTlsConfig;
    } else {
      delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    }
  }
});
