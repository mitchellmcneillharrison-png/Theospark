// Theospark API client.
//
// The real API is not hooked up yet. When it is, set these in a `.env` file:
//   VITE_THEOSPARK_API_URL=...   (your backend / proxy endpoint)
//   VITE_THEOSPARK_API_KEY=...
// and adjust the fetch body in `askTheospark` to match your provider.

const API_URL = import.meta.env.VITE_THEOSPARK_API_URL || ''
const API_KEY = import.meta.env.VITE_THEOSPARK_API_KEY || ''

// Two study modes: Deep runs on a fast basic model, Deeper on an advanced one.
export const MODES = {
  deep: {
    id: 'deep',
    label: 'Deep',
    model: 'basic-model', // swap for your basic model id
    tagline: 'Quick, faithful answers',
  },
  deeper: {
    id: 'deeper',
    label: 'Deeper',
    model: 'advanced-model', // swap for your advanced model id
    tagline: 'Advanced study with full nuance',
  },
}

export const DENOMINATIONS = [
  'Non-denominational',
  'Catholic',
  'Eastern Orthodox',
  'Baptist',
  'Methodist',
  'Lutheran',
  'Presbyterian / Reformed',
  'Anglican / Episcopal',
  'Pentecostal',
]

function systemPrompt(denomination) {
  return [
    'You are Theospark, a Christian theology assistant.',
    'You answer questions about denominations, Bible verses, doctrine, and historical context.',
    `Answer from the perspective of the ${denomination} tradition, and note where other major traditions differ when it is helpful.`,
    'Cite Scripture references and historical sources where relevant.',
  ].join(' ')
}

export async function askTheospark({ messages, mode, denomination }) {
  const { model } = MODES[mode] ?? MODES.deep

  if (!API_URL || !API_KEY) {
    // Placeholder response until the API is connected.
    await new Promise((r) => setTimeout(r, 600))
    return (
      `(${MODES[mode]?.label ?? 'Deep'} mode · ${denomination} perspective — API not connected yet.) ` +
      'Once an API key and endpoint are configured, I will answer your question here with Scripture references and historical context.'
    )
  }

  const res = await fetch(API_URL, {
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
  if (!res.ok) {
    throw new Error(`Theospark API error: ${res.status}`)
  }
  const data = await res.json()
  // Adjust to your provider's response shape.
  return data.reply ?? data.content ?? JSON.stringify(data)
}
