const API_URL = process.env.API_URL || 'https://captain.sapimu.au/goodshort/api/v1';
const TOKEN = process.env.AUTH_TOKEN;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { channelId = '562', page = '1', pageSize = '20' } = req.query;
  try {
    const response = await fetch(`${API_URL}/home?channelId=${channelId}&page=${page}&pageSize=${pageSize}`, {
      headers: { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'GoodShort-App/1.0' }
    });
    const json = await response.json();
    const records = json.data?.records || [];
    const dramas = records.flatMap(s => (s.items || []).map(i => ({ bookId: i.bookId, bookName: i.bookName, cover: i.image, labels: i.labels || [] })));
    res.json({ data: dramas });
  } catch (err) { res.status(500).json({ error: err.message }); }
}
