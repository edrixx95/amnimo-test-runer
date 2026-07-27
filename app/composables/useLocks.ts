import { useState } from "#app";
import { onMounted, onUnmounted } from "vue";
import { useToast } from "./useToast";

export interface LockInfo {
  resource: string;
  sessionId: string;
  sessionName?: string;
  acquiredAt: number;
}

export interface LockEventLog {
  id: string;
  type: "acquired" | "released";
  lock: LockInfo;
  timestamp: number;
}

// Global state across the app
export const useLocks = () => {
  const activeLocks = useState<LockInfo[]>("active-locks", () => []);
  const eventLogs = useState<LockEventLog[]>("lock-event-logs", () => []);
  const isConnected = useState<boolean>("locks-sse-connected", () => false);
  const showEventLog = useState<boolean>("show-event-log", () => false);

  const { addToast } = useToast();
  const { t } = useI18n();

  const connect = () => {
    if (isConnected.value || import.meta.server) return;
    
    let eventSource: EventSource | null = new EventSource("/api/locks/stream");
    isConnected.value = true;

    eventSource.addEventListener("initial_state", (e) => {
      try {
        const data = JSON.parse(e.data);
        activeLocks.value = data;
      } catch (err) {
        console.error("Failed to parse initial_state:", err);
      }
    });

    eventSource.addEventListener("lock_acquired", (e) => {
      try {
        const lock: LockInfo = JSON.parse(e.data);
        
        // Add or update lock
        const index = activeLocks.value.findIndex(l => l.resource === lock.resource);
        if (index > -1) {
          activeLocks.value[index] = lock;
        } else {
          activeLocks.value.push(lock);
        }

        // Add to log
        eventLogs.value.unshift({
          id: Math.random().toString(36).substring(2, 9),
          type: "acquired",
          lock,
          timestamp: Date.now()
        });

        // Show toast
        addToast({
          title: t("notifications.deviceLocked"),
          message: `${t("notifications.resource")}: ${lock.resource} - ${t("notifications.bySession")} ${lock.sessionName || lock.sessionId}`,
          type: "warning",
          duration: 5000,
        });
      } catch (err) {
        console.error("Failed to parse lock_acquired:", err);
      }
    });

    eventSource.addEventListener("lock_released", (e) => {
      try {
        const lock: LockInfo = JSON.parse(e.data);
        
        // Remove lock
        activeLocks.value = activeLocks.value.filter(l => l.resource !== lock.resource);

        // Add to log
        eventLogs.value.unshift({
          id: Math.random().toString(36).substring(2, 9),
          type: "released",
          lock,
          timestamp: Date.now()
        });

        // Show toast
        addToast({
          title: t("notifications.deviceUnlocked"),
          message: `${t("notifications.resource")}: ${lock.resource}`,
          type: "success",
          duration: 5000,
        });
      } catch (err) {
        console.error("Failed to parse lock_released:", err);
      }
    });

    eventSource.onerror = () => {
      eventSource?.close();
      isConnected.value = false;
      // Reconnect after 3 seconds
      setTimeout(connect, 3000);
    };

    onUnmounted(() => {
      // In a real SPA, we might want to keep it alive across navigations.
      // But if this is called in a specific component, we might not want to close it.
      // Since we want this to be global, we'll let it stay connected.
    });
  };

  return {
    activeLocks,
    eventLogs,
    showEventLog,
    connect,
  };
};
