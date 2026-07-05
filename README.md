# Theospark

A Christian theology AI chat app. Ask questions about denominations, Bible verses, doctrine, and historical context — answered from your denomination's perspective.

## Features

- **Single chat page** — no home page, just the conversation
- **Left toolbar** — history, projects, profile, settings, and more
- **Two study modes** — **Deep** (fast, basic model) and **Deeper** (advanced model for full nuance)
- **Denomination perspective** — pick your tradition in Settings; every answer is framed from it
- Conversation history persisted locally in the browser

## Running locally

```bash
npm install
npm run dev
```

With plain `npm run dev` the serverless function isn't running, so the chat
returns a placeholder reply — enough to click through the whole UI. To exercise
the real serverless endpoint locally, use the Vercel CLI:

```bash
npm i -g vercel
vercel dev
```

## Deploying to Vercel

The project is configured for Vercel out of the box (`vercel.json`):

- Vite front end builds to `dist` (auto-detected).
- The chat endpoint is the serverless function at `api/chat.js`, reachable at `/api/chat`.
- Non-API routes are rewritten to `index.html` for the single-page app.

Deploy by importing the repo in the Vercel dashboard, or run `vercel` from the
project root.

## Connecting the API

The API key stays **server-side** — it is never shipped to the browser. The
browser calls `/api/chat`, and the Vercel function makes the provider request.

Set these environment variables in **Vercel → Settings → Environment Variables**
(or in a local `.env.local` for `vercel dev` — see `.env.example`):

```
THEOSPARK_API_URL=your-endpoint
THEOSPARK_API_KEY=your-secret-key
```

The Deep / Deeper model ids and the upstream request/response shape are set in
`api/chat.js` (`MODE_MODELS` and the `fetch` call). Deep maps to the basic
model, Deeper to the advanced one.
