# Theospark

A Christian theology AI chat app. Ask questions about denominations, Bible verses, doctrine, and historical context — answered from your denomination's perspective.

## Features

- **Single chat page** — no home page, just the conversation
- **Left toolbar** — history, projects, profile, settings, and more
- **Two study modes** — **Deep** (fast, basic model) and **Deeper** (advanced model for full nuance)
- **Denomination perspective** — pick your tradition in Settings; every answer is framed from it
- Conversation history persisted locally in the browser

## Running

```bash
npm install
npm run dev
```

## Connecting the API

The API is stubbed until keys are added. Copy `.env.example` to `.env` and fill in:

```
VITE_THEOSPARK_API_URL=your-endpoint
VITE_THEOSPARK_API_KEY=your-key
```

Model ids for the Deep and Deeper modes are set in `src/api/client.js` (`MODES`), and the request/response shape can be adjusted in `askTheospark` in the same file.
