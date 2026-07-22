export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const targetUrl = query.url as string;
  
  if (!targetUrl) {
    throw createError({ statusCode: 400, statusMessage: 'Missing url parameter' });
  }

  // Ensure url is from our allowed domains
  if (!targetUrl.startsWith('https://tk2-221-20474.vs.sakura.ne.jp/firmware/') && 
      !targetUrl.startsWith('https://package.amnimo.com/firmware/')) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden URL' });
  }

  const authHeader = 'Basic YW1uaW1vOmFlbWUyRm9hOUdlU2VpYWo=';
  
  // Extract filename for Content-Disposition
  const urlObj = new URL(targetUrl);
  const filename = urlObj.pathname.split('/').pop() || 'firmware.amf';
  
  // Set headers to force download
  setResponseHeader(event, 'Content-Disposition', `attachment; filename="${filename}"`);
  
  return proxyRequest(event, targetUrl, {
    headers: {
      Authorization: authHeader
    }
  });
});
