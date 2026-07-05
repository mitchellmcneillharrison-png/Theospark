import {
  BookIcon,
  ChurchIcon,
  ScrollIcon,
  CrossIcon,
  SunIcon,
  GlobeIcon,
} from './Icons.jsx'

const SUGGESTIONS = [
  { icon: BookIcon, label: 'Explain a Bible verse', prompt: 'Can you explain the meaning of John 3:16 in its original context?' },
  { icon: ChurchIcon, label: 'Compare denominations', prompt: 'What are the main differences between Baptist and Methodist beliefs?' },
  { icon: ScrollIcon, label: 'Historical context', prompt: 'What was the historical context of Paul’s letter to the Romans?' },
  { icon: CrossIcon, label: 'Doctrine & creeds', prompt: 'What does the Nicene Creed teach, and why was it written?' },
  { icon: SunIcon, label: 'Daily devotion', prompt: 'Give me a short devotional reflection for today with a verse.' },
  { icon: GlobeIcon, label: 'Church history', prompt: 'How did the early church spread in the first three centuries?' },
]

function EmptyState({ denomination, onSuggestion }) {
  return (
    <div className="empty-state">
      <span className="assistant-badge">Theology AI assistant</span>
      <h1 className="greeting">
        Hello there,
        <br />
        How can I help today?
      </h1>
      <p className="greeting-sub">
        Answers from a {denomination} perspective
      </p>
      <div className="chips">
        {SUGGESTIONS.map(({ icon: ChipIcon, label, prompt }) => (
          <button key={label} className="chip" onClick={() => onSuggestion(prompt)}>
            <ChipIcon size={17} />
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Chat({ messages, isThinking, denomination, onSuggestion, endRef }) {
  if (messages.length === 0) {
    return <EmptyState denomination={denomination} onSuggestion={onSuggestion} />
  }

  return (
    <div className="messages">
      {messages.map((m, i) => (
        <div key={i} className={`message ${m.role}`}>
          <div className="bubble">{m.content}</div>
        </div>
      ))}
      {isThinking && (
        <div className="message assistant">
          <div className="bubble thinking">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  )
}
