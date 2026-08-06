/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, computed } from "vue";

export function useNetworkCheck(
  baseUrlRef: { value: string },
  expectedBoardRef?: { value: string },
  expectedSeriesRef?: { value: string },
) {
  const pingCheckStatus = ref<"idle" | "checking" | "success" | "failed">(
    "idle",
  );
  const pingCheckError = ref<string>("");

  const deviceInfoCheckStatus = ref<"idle" | "checking" | "success" | "failed">(
    "idle",
  );
  const deviceInfoCheckError = ref<string>("");

  const pingStatus = computed(() => {
    if (
      pingCheckStatus.value === "failed" ||
      deviceInfoCheckStatus.value === "failed"
    )
      return "failed";
    if (
      pingCheckStatus.value === "success" &&
      deviceInfoCheckStatus.value === "success"
    )
      return "success";
    if (
      pingCheckStatus.value === "checking" ||
      deviceInfoCheckStatus.value === "checking"
    )
      return "pinging";
    return "idle";
  });

  const pingErrorMessage = computed(() => {
    if (pingCheckStatus.value === "failed") return pingCheckError.value;
    if (deviceInfoCheckStatus.value === "failed")
      return deviceInfoCheckError.value;
    return "";
  });

  const isPinging = computed(() => pingStatus.value === "pinging");
  let pingInterval: any = null;

  const pingDevice = async (silent = false) => {
    if (silent && pingStatus.value === "success") {
      return;
    }

    if (!silent) {
      pingCheckStatus.value = "checking";
      deviceInfoCheckStatus.value = "idle";
      pingCheckError.value = "";
      deviceInfoCheckError.value = "";
    }
    try {
      const ipMatch = baseUrlRef.value.match(/https?:\/\/([^:]+)/);
      const ip = ipMatch ? ipMatch[1] : baseUrlRef.value;

      const res = await $fetch<{ success: boolean }>("/api/network/ping", {
        method: "POST",
        body: { ip },
      });

      if (res.success) {
        if (pingCheckStatus.value !== "success") {
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
        pingCheckStatus.value = "success";

        if (expectedBoardRef?.value && expectedSeriesRef?.value) {
          deviceInfoCheckStatus.value = "checking";
          try {
            const infoRes = await $fetch<any>("/api/proxy/device/information", {
              method: "POST",
              body: {
                targetUrl: baseUrlRef.value,
              },
            });
            const board = infoRes?.content?.board;
            const series = infoRes?.content?.series;
            if (
              board !== expectedBoardRef.value ||
              series !== expectedSeriesRef.value
            ) {
              deviceInfoCheckStatus.value = "failed";
              deviceInfoCheckError.value = `Expected: ${expectedSeriesRef.value} ${expectedBoardRef.value}, Actual: ${series} ${board}`;
              return;
            } else {
              deviceInfoCheckStatus.value = "success";
              stopPingPolling();
            }
          } catch (infoErr) {
            console.warn("Device information check failed:", infoErr);
            deviceInfoCheckStatus.value = "failed";
            deviceInfoCheckError.value = "Failed to fetch device information.";
            return;
          }
        } else {
          deviceInfoCheckStatus.value = "success";
          stopPingPolling();
        }
      } else {
        pingCheckStatus.value = "failed";
        pingCheckError.value = "Cannot reach device (ping failed).";
      }
    } catch (_err) {
      pingCheckStatus.value = "failed";
      pingCheckError.value = "Network error occurred.";
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
    pingCheckStatus.value = "idle";
    deviceInfoCheckStatus.value = "idle";
    pingCheckError.value = "";
    deviceInfoCheckError.value = "";
  };

  return {
    pingCheckStatus,
    pingCheckError,
    deviceInfoCheckStatus,
    deviceInfoCheckError,
    pingStatus,
    pingErrorMessage,
    isPinging,
    pingDevice,
    startPingPolling,
    stopPingPolling,
    resetPingStatus,
  };
}
