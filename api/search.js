const API_URL = process.env.API_URL || 'https://captain.sapimu.au/goodshort/api/v1';
const TOKEN = process.env.AUTH_TOKEN;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Missing query' });
  try {
    const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(q)}`, {
      headers: { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'GoodShort-App/1.0' }
    });
    const json = await response.json();
    const records = json.data?.searchResult?.records || [];
    const dramas = records.map(i => ({ bookId: i.bookId, bookName: i.bookName, cover: i.cover }));
    res.json({ data: dramas });
  } catch (err) { res.status(500).json({ error: err.message }); }
}
