export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url, keyData } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url' });
  
  try {
    const response = await fetch(url);
    if (url.endsWith('.m3u8')) {
      const baseUrl = url.substring(0, url.lastIndexOf('/') + 1);
      let m3u8 = await response.text();
      m3u8 = m3u8.replace(/^([^#\n].+\.ts)$/gm, baseUrl + '$1');
      m3u8 = m3u8.replace(/URI="local:\/\/[^"]+"/g, `URI="/api/key?data=${encodeURIComponent(keyData)}"`);
      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      res.send(m3u8);
    } else {
      res.setHeader('Content-Type', response.headers.get('content-type'));
      res.send(Buffer.from(await response.arrayBuffer()));
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
}
