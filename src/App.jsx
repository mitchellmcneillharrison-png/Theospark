import { useEffect, useRef, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Chat from './components/Chat.jsx'
import Composer from './components/Composer.jsx'
import SettingsPanel from './components/SettingsPanel.jsx'
import { GearIcon } from './components/Icons.jsx'
import { askTheospark, DENOMINATIONS } from './api/client.js'

const STORAGE_KEY = 'theospark:conversations'
const PREFS_KEY = 'theospark:prefs'

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export default function App() {
  const [conversations, setConversations] = useState(() => loadJSON(STORAGE_KEY, []))
  const [activeId, setActiveId] = useState(null)
  const [draft, setDraft] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [prefs, setPrefs] = useState(() =>
    loadJSON(PREFS_KEY, { mode: 'deep', denomination: DENOMINATIONS[0] }),
  )
  const endRef = useRef(null)
  const toastTimer = useRef(null)

  const active = conversations.find((c) => c.id === activeId)
  const messages = active?.messages ?? []

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
  }, [conversations])

  useEffect(() => {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
  }, [prefs])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, isThinking])

  function showToast(text) {
    setToast(text)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2200)
  }

  function appendMessage(id, message) {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, messages: [...c.messages, message] } : c)),
    )
  }

  async function send(text) {
    const content = text.trim()
    if (!content || isThinking) return

    let id = activeId
    let history = messages
    if (!id) {
      id = crypto.randomUUID()
      const title = content.length > 42 ? content.slice(0, 42) + '…' : content
      setConversations((prev) => [{ id, title, messages: [] }, ...prev])
      setActiveId(id)
      history = []
    }

    const userMessage = { role: 'user', content }
    appendMessage(id, userMessage)
    setDraft('')
    setIsThinking(true)
    try {
      const reply = await askTheospark({
        messages: [...history, userMessage],
        mode: prefs.mode,
        denomination: prefs.denomination,
      })
      appendMessage(id, { role: 'assistant', content: reply })
    } catch (err) {
      appendMessage(id, {
        role: 'assistant',
        content: `Something went wrong reaching the Theospark API (${err.message}). Please try again.`,
      })
    } finally {
      setIsThinking(false)
    }
  }

  return (
    <div className="app">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onNewChat={() => setActiveId(null)}
        onSelectConversation={setActiveId}
        onOpenSettings={() => setSettingsOpen(true)}
        onPlaceholder={(name) => showToast(`${name} is coming soon`)}
      />

      <main className="chat-pane">
        <div className="glow" />
        <div className="grain" />

        <header className="chat-header">
          <button
            className="icon-btn"
            aria-label="Settings"
            onClick={() => setSettingsOpen(true)}
          >
            <GearIcon size={20} />
          </button>
        </header>

        <section className="chat-body">
          <Chat
            messages={messages}
            isThinking={isThinking}
            denomination={prefs.denomination}
            onSuggestion={(prompt) => send(prompt)}
            endRef={endRef}
          />
        </section>

        <Composer
          value={draft}
          onChange={setDraft}
          onSend={() => send(draft)}
          mode={prefs.mode}
          onModeChange={(mode) => setPrefs((p) => ({ ...p, mode }))}
          disabled={isThinking}
        />

        {toast && <div className="toast">{toast}</div>}
      </main>

      <SettingsPanel
        open={settingsOpen}
        denomination={prefs.denomination}
        onDenominationChange={(denomination) => setPrefs((p) => ({ ...p, denomination }))}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  )
}
