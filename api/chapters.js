const API_URL = process.env.API_URL || 'https://captain.sapimu.au/goodshort/api/v1';
const TOKEN = process.env.AUTH_TOKEN;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing id' });
  try {
    const response = await fetch(`${API_URL}/chapters/${id}`, {
      headers: { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'GoodShort-App/1.0' }
    });
    res.json(await response.json());
  } catch (err) { res.status(500).json({ error: err.message }); }
}
