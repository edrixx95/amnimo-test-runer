 
 
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, computed } from 'vue';

export function useNetworkCheck(baseUrlRef: { value: string }) {
  const pingStatus = ref<"idle" | "pinging" | "success" | "failed">("idle");
  const isPinging = computed(() => pingStatus.value === "pinging");
  let pingInterval: any = null;

  const pingDevice = async (silent = false) => {
    if (!silent) pingStatus.value = "pinging";
    try {
      const ipMatch = baseUrlRef.value.match(/https?:\/\/([^:]+)/);
      const ip = ipMatch ? ipMatch[1] : baseUrlRef.value;

      const res = await $fetch<{ success: boolean }>("/api/network/ping", {
        method: "POST",
        body: { ip },
      });

      if (res.success) {
        if (pingStatus.value !== "success") {
          try {
            await $fetch("/api/proxy/device/startup-check", {
              method: "POST",
              body: {
                targetUrl: baseUrlRef.value,
                defaultPassword: "yoko1234",
              },
            });
          } catch (startupErr) {
            console.warn("Startup check failed or not applicable:", startupErr);
          }
        }
        pingStatus.value = "success";
      } else {
        pingStatus.value = "failed";
      }
    } catch (_err) {
      pingStatus.value = "failed";
    }
  };

  const startPingPolling = () => {
    stopPingPolling();
    pingDevice(pingStatus.value !== "idle"); // If idle, show loading, otherwise silent
    pingInterval = setInterval(() => {
      pingDevice(true);
    }, 3000);
  };

  const stopPingPolling = () => {
    if (pingInterval) {
      clearInterval(pingInterval);
      pingInterval = null;
    }
  };

  const resetPingStatus = () => {
    pingStatus.value = "idle";
  };

  return {
    pingStatus,
    isPinging,
    pingDevice,
    startPingPolling,
    stopPingPolling,
    resetPingStatus
  };
}
