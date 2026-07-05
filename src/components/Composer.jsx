import { useState } from 'react'
import { PlusIcon, MicIcon, SendIcon } from './Icons.jsx'
import { MODES } from '../api/client.js'

export default function Composer({ value, onChange, onSend, mode, onModeChange, disabled }) {
  const [focused, setFocused] = useState(false)
  const hasText = value.trim().length > 0

  function submit(e) {
    e.preventDefault()
    if (hasText && !disabled) onSend()
  }

  return (
    <div className="composer">
      <div className="mode-toggle" role="tablist" aria-label="Study mode">
        {Object.values(MODES).map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={mode === m.id}
            className={`mode-option${mode === m.id ? ' active' : ''}`}
            onClick={() => onModeChange(m.id)}
            title={m.tagline}
          >
            {m.label}
          </button>
        ))}
      </div>

      <form className={`input-bar${focused ? ' focused' : ''}`} onSubmit={submit}>
        <button type="button" className="attach-btn" aria-label="Add attachment">
          <PlusIcon size={19} />
        </button>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Got questions..."
          aria-label="Ask a theology question"
        />
        <button
          type="submit"
          className="send-btn"
          aria-label={hasText ? 'Send' : 'Voice input'}
          disabled={disabled}
        >
          {hasText ? <SendIcon size={18} /> : <MicIcon size={18} />}
        </button>
      </form>
    </div>
  )
}
