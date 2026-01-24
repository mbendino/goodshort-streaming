import express from 'express'
import { config } from 'dotenv'

config()

const app = express()
const API_URL = process.env.API_URL || 'https://captain.sapimu.au/goodshort/api/v1'
const TOKEN = process.env.AUTH_TOKEN

app.get('/api/home', async (req, res) => {
  const { channelId = '562', page = '1', pageSize = '20' } = req.query
  try {
    const response = await fetch(`${API_URL}/home?channelId=${channelId}&page=${page}&pageSize=${pageSize}`, {
      headers: { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'GoodShort-App/1.0' }
    })
    const json = await response.json()
    const records = json.data?.records || []
    const dramas = records.flatMap(s => (s.items || []).map(i => ({ bookId: i.bookId, bookName: i.bookName, cover: i.image || i.cover, labels: i.labels || [] })))
    res.json({ data: dramas })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/search', async (req, res) => {
  const { q } = req.query
  if (!q) return res.status(400).json({ error: 'Missing query' })
  try {
    const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(q)}`, {
      headers: { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'GoodShort-App/1.0' }
    })
    const json = await response.json()
    const records = json.data?.searchResult?.records || []
    const dramas = records.map(i => ({ bookId: i.bookId, bookName: i.bookName, cover: i.cover }))
    res.json({ data: dramas })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/book', async (req, res) => {
  const { id } = req.query
  if (!id) return res.status(400).json({ error: 'Missing id' })
  try {
    const response = await fetch(`${API_URL}/book/${id}`, {
      headers: { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'GoodShort-App/1.0' }
    })
    res.json(await response.json())
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/chapters', async (req, res) => {
  const { id } = req.query
  if (!id) return res.status(400).json({ error: 'Missing id' })
  try {
    const response = await fetch(`${API_URL}/chapters/${id}`, {
      headers: { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'GoodShort-App/1.0' }
    })
    res.json(await response.json())
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/play', async (req, res) => {
  const { bookId, chapterId } = req.query
  if (!bookId || !chapterId) return res.status(400).json({ error: 'Missing bookId or chapterId' })
  try {
    const response = await fetch(`${API_URL}/play/${bookId}/${chapterId}`, {
      headers: { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'GoodShort-App/1.0' }
    })
    const json = await response.json()
    if (json.k && json.s) {
      json.keyData = Buffer.from(JSON.stringify({ k: json.k, s: json.s })).toString('base64url')
    }
    res.json(json)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/key', (req, res) => {
  const { data } = req.query
  if (!data) return res.status(400).send('Missing data')
  try {
    const keyData = JSON.parse(Buffer.from(data, 'base64url').toString())
    const decoded = Buffer.from(keyData.k, 'base64')
    const s = keyData.s
    let keyHex = ''
    for (let i = 0; i < 32; i++) keyHex += String.fromCharCode(decoded[i] ^ s.charCodeAt(i % s.length))
    res.set('Content-Type', 'application/octet-stream')
    res.send(Buffer.from(keyHex, 'hex'))
  } catch (err) { res.status(500).send(err.message) }
})

app.get('/api/video', async (req, res) => {
  const { url, keyData } = req.query
  if (!url) return res.status(400).json({ error: 'Missing url' })
  try {
    const response = await fetch(url)
    if (url.endsWith('.m3u8')) {
      const baseUrl = url.substring(0, url.lastIndexOf('/') + 1)
      let m3u8 = await response.text()
      m3u8 = m3u8.replace(/^([^#\n].+\.ts)$/gm, baseUrl + '$1')
      m3u8 = m3u8.replace(/URI="local:\/\/[^"]+"/g, `URI="/api/key?data=${encodeURIComponent(keyData)}"`)
      res.set('Content-Type', 'application/vnd.apple.mpegurl')
      res.send(m3u8)
    } else {
      res.set('Content-Type', response.headers.get('content-type'))
      res.send(Buffer.from(await response.arrayBuffer()))
    }
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.use(express.static('dist'))
app.get('/{*path}', (req, res) => res.sendFile('index.html', { root: 'dist' }))

app.listen(3002, () => console.log('GoodShort server running on port 3002'))
