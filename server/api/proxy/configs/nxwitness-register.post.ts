import { defineEventHandler, readBody, createError } from "h3";
import { z } from "zod";

const bodySchema = z.object({
  targetUrl: z.string().url("Invalid target URL"),
  defaultPassword: z.string().default("admin"),
  newPassword: z.string().default("yoko1234"),
  systemName: z.string().default("amnimo"),
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

  const { targetUrl, defaultPassword, newPassword, systemName } = result.data;

  // Nx Witness Media Server is on port 7001
  // We need to parse targetUrl (e.g. https://192.168.0.254) and use port 7001
  const baseUrl = new URL(targetUrl);
  baseUrl.port = "7001";
  const nxServerUrl = baseUrl.toString().replace(/\/$/, "");

  try {
    // Step 1: Authenticate with default credentials (admin / admin)
    const loginUrl = `${nxServerUrl}/web/rest/v1/login/sessions`;

    console.log(
      `[Nx Witness Register] Attempting default login to ${loginUrl}`,
    );
    const authResponse = await $fetch.raw(loginUrl, {
      method: "POST",
      body: {
        username: "admin",
        password: defaultPassword,
        setCookie: true,
      },
      ignoreResponseError: true,
      timeout: 10000,
      rejectUnauthorized: false, // Self-signed cert handling
    });

    // If we get a 401 Unauthorized or 403 Forbidden here, it means the password isn't 'admin'
    // The device might already be registered.
    if (authResponse.status === 401 || authResponse.status === 403) {
      return {
        success: true,
        message:
          "Device already registered or password changed. Skipping factory setup.",
        alreadyRegistered: true,
      };
    }

    if (authResponse.status !== 200 && authResponse.status !== 201) {
      throw createError({
        statusCode: authResponse.status,
        statusMessage:
          "Failed to authenticate with Nx Witness server for registration",
      });
    }

    const setCookieHeader = authResponse.headers.get("set-cookie");
    const sessionId = setCookieHeader ? setCookieHeader.split(";")[0] : null;

    if (!sessionId) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to get session cookie from Nx Witness server",
      });
    }

    // Step 2: Initialize system setup
    const setupUrl = `${nxServerUrl}/web/rest/v2/system/setup`;
    console.log(`[Nx Witness Register] Initializing system at ${setupUrl}`);

    const setupResponse = await $fetch.raw(setupUrl, {
      method: "POST",
      headers: {
        Cookie: sessionId,
        "Content-Type": "application/json",
      },
      body: {
        name: systemName,
        settings: {
          autoDiscoveryEnabled: true,
          cameraSettingsOptimization: true,
          statisticsAllowed: true,
        },
        local: {
          password: newPassword,
        },
      },
      ignoreResponseError: true,
      timeout: 15000,
      rejectUnauthorized: false,
    });

    if (setupResponse.status !== 200 && setupResponse.status !== 201) {
      throw createError({
        statusCode: setupResponse.status,
        statusMessage: "Failed to initialize Nx Witness system setup",
      });
    }

    return {
      success: true,
      message: "Nx Witness media server successfully registered",
      alreadyRegistered: false,
    };
  } catch (error: any) {
    console.error("Nx Witness register proxy error:", error);
    throw createError({
      statusCode: error.response?.status || error.statusCode || 500,
      statusMessage:
        error.message ||
        error.statusMessage ||
        "Failed to communicate with Nx Witness server",
    });
  }
});
