export default defineEventHandler(async (_event) => {
  const authHeader = "Basic YW1uaW1vOmFlbWUyRm9hOUdlU2VpYWo="; // base64 of amnimo:aeme2Foa9GeSeiaj

  const sources = [
    { id: "staging", url: "https://tk2-221-20474.vs.sakura.ne.jp/firmware/" },
    { id: "production", url: "https://package.amnimo.com/firmware/" },
  ];

  const results = [];

  for (const source of sources) {
    try {
      const response = await fetch(source.url, {
        headers: { Authorization: authHeader },
      });

      if (!response.ok) {
        console.error(`Failed to fetch ${source.url}: ${response.statusText}`);
        continue;
      }

      const html = await response.text();

      // Basic HTML parsing for apache/nginx directory listing
      // <a href="ac10-1.11.0-b49054.amf">ac10-1.11.0-b49054.amf</a>                             15-Jan-2026 13:27            57048784
      const regex =
        /<a href="([^"]+\.amf)">.*?<\/a>\s+(\d{2}-[A-Za-z]{3}-\d{4} \d{2}:\d{2})\s+(\d+)/g;
      let match;

      while ((match = regex.exec(html)) !== null) {
        const filename = match[1]!;
        const dateStr = match[2]!;
        const sizeBytes = parseInt(match[3]!, 10);

        if (filename.includes("bootloader.amf")) continue;

        // Match <board>-<version>-b<build>.amf or <board>_<board2>-<version>-b<build>.amf
        // Also support modem firmwares.
        const fileRegex = /^([a-zA-Z0-9_]+)-(.*?)-b(\d+)(.*)\.amf$/i;
        const fileMatch = filename.match(fileRegex);

        let board = "Unknown";
        let version = "Unknown";
        let build = "Unknown";
        const isModem = filename.toLowerCase().includes("modem");

        if (fileMatch) {
          board = fileMatch[1]!.toUpperCase();
          version = fileMatch[2]!;
          build = fileMatch[3]!;
        } else if (isModem) {
          // It might be named differently but is a modem firmware
          board = "Modem";
        } else {
          // Skip files that don't match our pattern at all
          continue;
        }

        results.push({
          filename,
          source: source.id,
          board,
          version,
          build,
          isModem,
          date: dateStr,
          size: sizeBytes,
          url: `${source.url}${filename}`,
        });
      }
    } catch (e) {
      console.error(`Error fetching firmware from ${source.id}:`, e);
    }
  }

  // Sort by date descending
  results.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return results;
});
