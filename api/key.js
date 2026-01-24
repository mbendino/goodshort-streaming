export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { data } = req.query;
  if (!data) return res.status(400).send('Missing data');
  
  try {
    const keyData = JSON.parse(Buffer.from(data, 'base64url').toString());
    const decoded = Buffer.from(keyData.k, 'base64');
    const s = keyData.s;
    let keyHex = '';
    for (let i = 0; i < 32; i++) keyHex += String.fromCharCode(decoded[i] ^ s.charCodeAt(i % s.length));
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(Buffer.from(keyHex, 'hex'));
  } catch (err) { res.status(500).send(err.message); }
}
