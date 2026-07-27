import { lockManager, type LockInfo } from "../../utils/lockManager";

export default defineEventHandler((event) => {
  // Set headers for Server-Sent Events
  setHeaders(event, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  // Create the stream
  const stream = new ReadableStream({
    start(controller) {
      const sendEvent = (eventType: string, data: any) => {
        try {
          controller.enqueue(
            `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`
          );
        } catch (e) {
          console.error("Error writing to lock SSE stream:", e);
        }
      };

      // Send initial state
      sendEvent("initial_state", lockManager.getAllLocks());

      const onLockAcquired = (lockInfo: LockInfo) => {
        sendEvent("lock_acquired", lockInfo);
      };

      const onLockReleased = (lockInfo: LockInfo) => {
        sendEvent("lock_released", lockInfo);
      };

      // Listen to events
      lockManager.events.on("lock_acquired", onLockAcquired);
      lockManager.events.on("lock_released", onLockReleased);

      // Handle client disconnect
      event.node.req.on("close", () => {
        lockManager.events.off("lock_acquired", onLockAcquired);
        lockManager.events.off("lock_released", onLockReleased);
      });
    },
  });

  return sendStream(event, stream);
});
