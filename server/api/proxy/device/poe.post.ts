 
/* eslint-disable prefer-const, @typescript-eslint/no-explicit-any */
import { $fetch } from "ofetch";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { baseUrl, username, password } = body;

  const urlStr = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;

  const originalTlsConfig = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  try {
    let authHeaders: Record<string, string> = {
      Accept: "application/json",
    };

    if (username && password) {
      try {
        const authRes = await $fetch.raw(`${urlStr}/api/auth`, {
          method: "POST",
          body: { username, password },
          headers: { "Content-Type": "application/json" },
          timeout: 120000,
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

    const res = await $fetch(`${urlStr}/api/device/poe`, {
      method: "GET",
      headers: authHeaders,
      timeout: 120000,
    });

    return res;
  } catch (err: any) {
    if (err.status === 401) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }
    throw createError({
      statusCode: 500,
      statusMessage: err.message || "Failed to communicate with device",
    });
  } finally {
    if (originalTlsConfig !== undefined) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalTlsConfig;
    } else {
      delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    }
  }
});
