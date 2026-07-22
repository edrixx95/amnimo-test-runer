export default defineEventHandler(async (event) => {
  try {
    const response = await fetch('https://tk2-221-20474.vs.sakura.ne.jp/firmware/', {
      headers: {
        'Authorization': 'Basic ' + Buffer.from('amnimo:aeme2Foa9GeSeiaj').toString('base64')
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch firmwares: ${response.statusText}`);
    }

    const html = await response.text();
    // Match href attributes that end with .amf
    const regex = /href="([^"]+\.amf)"/g;
    const firmwares = new Set<string>();
    
    let match;
    while ((match = regex.exec(html)) !== null) {
      firmwares.add(match[1]);
    }

    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    
    return Array.from(firmwares).sort((a, b) => collator.compare(b, a)); // Sort descending numerically
  } catch (error: any) {
    console.error('Firmware fetch error:', error);
    return []; // Return empty array on failure so UI doesn't break
  }
});
