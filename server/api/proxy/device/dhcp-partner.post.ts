import { $fetch } from "ofetch";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { targetUrl, username, password } = body;

  const urlStr = targetUrl.startsWith("http")
    ? targetUrl
    : `https://${targetUrl}`;

  // Temporarily bypass self-signed cert errors for the proxy request
  const originalTlsConfig = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  try {
    const authHeaders: Record<string, string> = {
      Accept: "application/json",
      Authorization:
        "Basic " + Buffer.from(`${username}:${password}`).toString("base64"),
    };

    // First try to login to get token/cookie if Basic Auth isn't enough
    try {
      const authRes = await $fetch.raw(`${urlStr}/api/auth`, {
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
    } catch (e) {
      // Ignore auth failure, fallback to Basic auth
    }

    // Try fetching network config to check DHCP
    let br0Config: any = null;
    let hasDhcpEnabled = false;

    const res: any = await $fetch(`${urlStr}/api/configs/interfaces`, {
      method: "GET",
      headers: authHeaders,
      timeout: 10000,
    });

    // Look for br0 and check dhcp4.enabled
    const interfaces = res?.content?.interfaces || [];
    for (const iface of interfaces) {
      if (iface.name === "br0") {
        br0Config = iface;
        if (iface.dhcp4?.enabled === true) {
          hasDhcpEnabled = true;
        }
        break;
      }
    }

    if (br0Config && hasDhcpEnabled) {
      return {
        success: true,
        message: "DHCP Client is enabled on br0 of the Partner GW",
        config: br0Config,
      };
    } else if (br0Config) {
      return {
        success: false,
        message: "Interface br0 is found but DHCP Client is NOT enabled on it.",
        config: br0Config,
      };
    } else {
      return {
        success: false,
        message: "Interface br0 could not be found on the Partner GW.",
      };
    }
  } catch (err: any) {
    if (err.status === 401) {
      throw createError({
        statusCode: 401,
        statusMessage:
          "Unauthorized to access Partner GW. Please check credentials.",
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: err.message || "Failed to communicate with Partner GW API",
    });
  } finally {
    if (originalTlsConfig !== undefined) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalTlsConfig;
    } else {
      delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    }
  }
});
