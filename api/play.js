const API_URL = process.env.API_URL || 'https://captain.sapimu.au/goodshort/api/v1';
const TOKEN = process.env.AUTH_TOKEN;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { bookId, chapterId } = req.query;
  if (!bookId || !chapterId) return res.status(400).json({ error: 'Missing bookId or chapterId' });
  try {
    const response = await fetch(`${API_URL}/play/${bookId}/${chapterId}`, {
      headers: { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'GoodShort-App/1.0' }
    });
    const json = await response.json();
    if (json.k && json.s) {
      // Encode key data in URL-safe base64
      json.keyData = Buffer.from(JSON.stringify({ k: json.k, s: json.s })).toString('base64url');
    }
    res.json(json);
  } catch (err) { res.status(500).json({ error: err.message }); }
}
