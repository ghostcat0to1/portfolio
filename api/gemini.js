// Mistral-backed, Gemini-shaped API for frontend compat — the LYCAON demo's
// request/response shape mirrors Gemini's contents/candidates format, but the
// actual model call below hits Mistral, not Google.
const RATE_LIMIT_MAX = 8
const RATE_WINDOW_MS = 60 * 60 * 1000
const requestLog = new Map() // ip -> timestamps; in-memory, resets on cold start

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.socket?.remoteAddress || 'unknown'
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const apiKey = process.env.MISTRAL_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' })

  // Rate limit before the Mistral call, to cap API cost exposure. Fail open
  // on any error so a legitimate visitor is never blocked by the check itself.
  try {
    const ip = getClientIp(req)
    if (ip !== 'unknown') {
      const now = Date.now()
      const timestamps = (requestLog.get(ip) || []).filter(t => now - t < RATE_WINDOW_MS)
      if (timestamps.length >= RATE_LIMIT_MAX) {
        return res.status(429).json({ error: "You've reached the free limit for now — try again in an hour." })
      }
      timestamps.push(now)
      requestLog.set(ip, timestamps)
    }
  } catch (err) {
    console.error('Rate limit check failed, proceeding (fail open):', err)
  }

  const { contents, systemInstruction, generationConfig } = req.body

  const messages = []
  if (systemInstruction?.parts?.[0]?.text) {
    messages.push({ role: 'system', content: systemInstruction.parts[0].text })
  }
  for (const c of contents || []) {
    messages.push({
      role: c.role === 'model' ? 'assistant' : 'user',
      content: c.parts?.[0]?.text || ''
    })
  }

  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'mistral-small-latest',
      messages,
      max_tokens: generationConfig?.maxOutputTokens || 8192,
      temperature: generationConfig?.temperature || 0.7,
    })
  })

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content || ''

  res.status(200).json({
    candidates: [{
      content: { parts: [{ text }], role: 'model' },
      finishReason: 'STOP'
    }]
  })
}