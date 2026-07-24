import { $fetch } from "ofetch";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { baseUrl, username, password } = body;

  // Ensure url uses https
  const urlStr = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;

  // Temporarily bypass self-signed cert errors for the proxy request
  const originalTlsConfig = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  try {
    let authHeaders: Record<string, string> = {
      Accept: "application/json",
    };

    // Step 1: Login if credentials provided
    if (username && password) {
      try {
        const authRes = await $fetch.raw(`${urlStr}/api/auth`, {
          method: "POST",
          body: { username, password },
          headers: { "Content-Type": "application/json" },
          timeout: 120000,
          // ignoreResponseError to handle status codes manually if needed
        });

        // 1. Extract Cookie if available
        const setCookie = authRes.headers.get("set-cookie");
        if (setCookie) {
          // Multiple cookies might be joined by comma, just pass the whole string
          authHeaders["Cookie"] = setCookie;
        }

        // 2. Extract Token from body if available (fallback)
        const authData: any = authRes._data;
        if (authData && authData.token) {
          authHeaders["Authorization"] = `Bearer ${authData.token}`;
        }

        // 3. Fallback to basic auth just in case the /api/auth endpoint is a dummy
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
        // If /api/auth returns 404, maybe the device doesn't have this endpoint. We can continue and let the next request fail.
        if (err.status !== 404) {
          throw err;
        }
      }
    }

    let isBusy = false;

    // Step 2: Update module info
    try {
      await $fetch(`${urlStr}/api/device/mobile`, {
        method: "POST",
        body: {},
        headers: authHeaders,
        timeout: 120000,
      });
    } catch (e: any) {
      if (e.response?._data?.result?.messages?.[0]?.code === "E542") {
        isBusy = true;
      }
      console.warn("POST /api/device/mobile failed, ignoring...", e);
    }

    // Step 3: Update SIM info for module 0
    try {
      await $fetch(`${urlStr}/api/device/mobile/sim`, {
        method: "POST",
        body: { "module-number": 0 },
        headers: authHeaders,
        timeout: 120000,
      });
    } catch (e: any) {
      if (e.response?._data?.result?.messages?.[0]?.code === "E542") {
        isBusy = true;
      }
      console.warn("POST /api/device/mobile/sim failed, ignoring...", e);
    }

    // Step 4: Fetch the refreshed mobile info
    const res: any = await $fetch(`${urlStr}/api/device/mobile`, {
      method: "GET",
      headers: authHeaders,
      timeout: 120000,
    });

    return { ...res, isBusy };
  } catch (err: any) {
    if (err.status === 401) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }
    throw createError({
      statusCode: 500,
      statusMessage: err.message || "Failed to communicate with device",
    });
  } finally {
    // Restore TLS setting
    if (originalTlsConfig !== undefined) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalTlsConfig;
    } else {
      delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    }
  }
});
