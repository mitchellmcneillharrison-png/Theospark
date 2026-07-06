// Theospark serverless chat endpoint (Vercel) — backed by Groq.
//
// The API key lives here on the server — it is NEVER shipped to the browser.
// Set GROQ_API_KEY in your Vercel project (Settings -> Environment Variables),
// or in a local .env.local when running `vercel dev`.
//
// Groq exposes an OpenAI-compatible chat completions API.

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

// Two study modes, each mapped to a Groq model.
//   Deep   -> Llama 3.1 8B Instant (fast, basic)
//   Deeper -> GPT-OSS 120B (advanced)
const MODE_MODELS = {
  deep: 'llama-3.1-8b-instant',
  deeper: 'openai/gpt-oss-120b',
}

function systemPrompt(denomination) {
  return [
    'You are Theospark, a Christian theology assistant.',
    'You answer questions about denominations, Bible verses, doctrine, and historical context.',
    `Answer from the perspective of the ${denomination} tradition, and note where other major traditions differ when it is helpful.`,
    'Cite Scripture references and historical sources where relevant.',
  ].join(' ')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const {
    messages = [],
    mode = 'deep',
    denomination = 'Non-denominational',
  } = req.body || {}
  const model = MODE_MODELS[mode] || MODE_MODELS.deep

  const API_KEY = process.env.GROQ_API_KEY

  // Placeholder response until the key is configured.
  if (!API_KEY) {
    res.status(200).json({
      reply:
        `(${mode === 'deeper' ? 'Deeper' : 'Deep'} mode · ${denomination} perspective — API not connected yet.) ` +
        'Set GROQ_API_KEY on the server and I will answer here with Scripture references and historical context.',
    })
    return
  }

  const chatMessages = [
    { role: 'system', content: systemPrompt(denomination) },
    ...messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map(({ role, content }) => ({ role, content })),
  ]

  try {
    const upstream = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: chatMessages,
        temperature: 0.5,
        max_tokens: 1536,
      }),
    })

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => '')
      res.status(502).json({ error: `Groq error ${upstream.status}: ${detail.slice(0, 300)}` })
      return
    }

    const data = await upstream.json()
    const reply = data.choices?.[0]?.message?.content?.trim()
    if (!reply) {
      res.status(502).json({ error: 'Groq returned an empty response' })
      return
    }
    res.status(200).json({ reply })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
