export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const apiKey = process.env.MISTRAL_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' })

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