import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const targetIp = query.targetIp as string;
  const targetPort = query.targetPort as string;

  if (!targetIp || !targetPort) {
    throw createError({
      statusCode: 400,
      statusMessage: "targetIp and targetPort are required",
    });
  }

  try {
    const searchString = `${targetIp}:${targetPort}`;

    // Using findstr to filter, making it faster and cleaner
    // Example netstat line:  TCP    192.168.0.6:54321    192.168.0.254:7001    ESTABLISHED     1234
    const { stdout } = await execAsync(
      `netstat -ano | findstr "${searchString}" | findstr "ESTABLISHED"`,
      { windowsHide: true },
    );

    // If output is not empty, there is an established connection
    if (stdout.trim().length > 0) {
      return { connected: true };
    } else {
      return { connected: false };
    }
  } catch (error: any) {
    // findstr returns exit code 1 if no match is found, which throws an error in exec.
    // We treat exit code 1 as simply "not connected".
    if (error.code === 1) {
      return { connected: false };
    }
    console.error("Netstat Error:", error.message);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to run netstat command",
    });
  }
});
