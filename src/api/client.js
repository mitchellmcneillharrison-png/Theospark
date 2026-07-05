// Theospark API client (browser side).
//
// The actual provider call and the secret key live in the Vercel serverless
// function at `api/chat.js` — the browser only talks to `/api/chat`, so the
// key is never exposed. Configure the key server-side (see api/chat.js).

// Two study modes: Deep runs on a fast basic model, Deeper on an advanced one.
// (These labels drive the UI toggle; the model ids live in api/chat.js.)
export const MODES = {
  deep: {
    id: 'deep',
    label: 'Deep',
    tagline: 'Quick, faithful answers',
  },
  deeper: {
    id: 'deeper',
    label: 'Deeper',
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

function placeholderReply(mode, denomination) {
  return (
    `(${MODES[mode]?.label ?? 'Deep'} mode · ${denomination} perspective — API not connected yet.) ` +
    'Run `vercel dev` (or deploy) with THEOSPARK_API_URL and THEOSPARK_API_KEY set, ' +
    'and I will answer your question here with Scripture references and historical context.'
  )
}

export async function askTheospark({ messages, mode, denomination }) {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages, mode, denomination }),
    })
    // A 404 means the serverless function route doesn't exist — i.e. we're
    // running plain `npm run dev` without the Vercel functions. On Vercel the
    // function is always present, so fall back to a placeholder here.
    if (res.status === 404) {
      await new Promise((r) => setTimeout(r, 500))
      return placeholderReply(mode, denomination)
    }
    if (!res.ok) {
      const detail = await res.text().catch(() => res.statusText)
      throw new Error(`Theospark API error: ${res.status} ${detail}`)
    }
    const data = await res.json()
    return data.reply ?? data.content ?? JSON.stringify(data)
  } catch (err) {
    // A TypeError means the fetch itself failed (network error) — again treat
    // it as "no function running locally" and fall back to the placeholder.
    if (err instanceof TypeError) {
      await new Promise((r) => setTimeout(r, 500))
      return placeholderReply(mode, denomination)
    }
    throw err
  }
}
