export default defineWebSocketHandler({
  open(peer) {
    console.log("[ws] Client connected:", peer.id);
    peer.send(
      JSON.stringify({
        type: "session.connected",
        payload: { message: "Welcome to amnimo-test-runner" },
      }),
    );
  },
  message(peer, message) {
    console.log("[ws] Message received:", message.text());
    // We can handle incoming messages if needed, e.g. ping/pong
  },
  close(peer, event) {
    console.log("[ws] Client disconnected:", peer.id);
  },
  error(peer, error) {
    console.error("[ws] Error:", error);
  },
});
