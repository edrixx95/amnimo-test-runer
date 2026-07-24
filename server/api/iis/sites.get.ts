import { exec } from "child_process";
import { promisify } from "util";
import os from "os";

const execAsync = promisify(exec);

function getLocalIp() {
  const nets = os.networkInterfaces();
  let ip = "localhost";
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        if (net.address.startsWith("192.168.0.")) {
          return net.address;
        }
        ip = net.address; // fallback to any external IP
      }
    }
  }
  return ip;
}

export default defineEventHandler(async (event) => {
  try {
    const { stdout: siteOut } = await execAsync(
      "%SystemRoot%\\System32\\inetsrv\\appcmd.exe list site",
      { windowsHide: true },
    );
    const { stdout: vdirOut } = await execAsync(
      "%SystemRoot%\\System32\\inetsrv\\appcmd.exe list vdir",
      { windowsHide: true },
    );

    const physicalPaths: Record<string, string> = {};
    for (const line of vdirOut.split("\n")) {
      const match = line.match(/VDIR "([^/]+)\/" \(physicalPath:([^)]+)\)/);
      if (match) {
        physicalPaths[match[1]!] = match[2]!;
      }
    }

    const localIp = getLocalIp();
    const sites = [];
    const lines = siteOut.split("\n");
    for (const line of lines) {
      if (!line.trim()) continue;
      // Format: SITE "Default Web Site" (id:1,bindings:http/*:80:,state:Started)
      const nameMatch = line.match(/SITE "([^"]+)"/);
      const stateMatch = line.match(/state:([^)]+)/);
      const bindingMatch = line.match(/bindings:[a-zA-Z]+\/\*:(\d+):/);

      if (nameMatch) {
        const siteName = nameMatch[1]!;
        sites.push({
          name: siteName,
          state: stateMatch ? stateMatch[1] : "Unknown",
          port: bindingMatch ? parseInt(bindingMatch[1]!, 10) : null,
          url: bindingMatch ? `http://${localIp}:${bindingMatch[1]!}` : null,
          physicalPath: physicalPaths[siteName] || null,
        });
      }
    }
    return sites;
  } catch (error: any) {
    console.error("Failed to get IIS sites:", error.message);
    throw createError({
      statusCode: 500,
      statusMessage:
        "Failed to access IIS. Please ensure the application is running as Administrator.",
    });
  }
});
