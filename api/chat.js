// Theospark serverless chat endpoint (Vercel).
//
// The API key lives here on the server — it is NEVER shipped to the browser.
// Set these in your Vercel project (Settings -> Environment Variables), or in
// a local .env / .env.local when running `vercel dev`:
//   THEOSPARK_API_URL   your provider / proxy endpoint
//   THEOSPARK_API_KEY   your secret key
// Adjust the upstream request/response shape to match your provider.

// Two study modes: Deep uses a fast basic model, Deeper an advanced one.
const MODE_MODELS = {
  deep: 'basic-model', // swap for your basic model id
  deeper: 'advanced-model', // swap for your advanced model id
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

  const API_URL = process.env.THEOSPARK_API_URL
  const API_KEY = process.env.THEOSPARK_API_KEY

  // Placeholder response until the provider is connected.
  if (!API_URL || !API_KEY) {
    res.status(200).json({
      reply:
        `(${mode === 'deeper' ? 'Deeper' : 'Deep'} mode · ${denomination} perspective — API not connected yet.) ` +
        'Once THEOSPARK_API_URL and THEOSPARK_API_KEY are set, I will answer your question here with Scripture references and historical context.',
    })
    return
  }

  try {
    const upstream = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model,
        system: systemPrompt(denomination),
        messages: messages.map(({ role, content }) => ({ role, content })),
      }),
    })

    if (!upstream.ok) {
      res.status(502).json({ error: `Upstream error: ${upstream.status}` })
      return
    }

    const data = await upstream.json()
    // Adjust to your provider's response shape.
    res.status(200).json({ reply: data.reply ?? data.content ?? JSON.stringify(data) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
