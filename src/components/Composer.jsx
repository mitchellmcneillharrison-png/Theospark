import { useRef } from 'react'
import { PlusIcon, MicIcon, SendIcon, BoltIcon, BookIcon } from './Icons.jsx'
import { MODES } from '../api/client.js'

const MODE_ICONS = { deep: BoltIcon, deeper: BookIcon }

export default function Composer({
  value,
  onChange,
  onSend,
  mode,
  onModeChange,
  disabled,
  variant = 'hero',
}) {
  const textareaRef = useRef(null)
  const hasText = value.trim().length > 0

  function submit(e) {
    e.preventDefault()
    if (hasText && !disabled) {
      onSend()
      if (textareaRef.current) textareaRef.current.style.height = 'auto'
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) submit(e)
  }

  function handleInput(e) {
    onChange(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  return (
    <form className="ask-box" onSubmit={submit}>
      <textarea
        ref={textareaRef}
        rows={variant === 'hero' ? 2 : 1}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={variant === 'hero' ? 'Ask anything...' : 'Ask a follow-up...'}
        aria-label="Ask a theology question"
      />
      <div className="ask-row">
        <div className="mode-switch" role="tablist" aria-label="Study mode">
          {Object.values(MODES).map((m) => {
            const ModeIcon = MODE_ICONS[m.id]
            return (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={mode === m.id}
                className={`mode-option${mode === m.id ? ' active' : ''}`}
                onClick={() => onModeChange(m.id)}
                title={m.tagline}
              >
                <ModeIcon size={15} />
                {m.label}
              </button>
            )
          })}
        </div>
        <div className="ask-actions">
          <button type="button" className="ghost-btn" aria-label="Add attachment">
            <PlusIcon size={19} />
          </button>
          <button type="button" className="ghost-btn" aria-label="Voice input">
            <MicIcon size={18} />
          </button>
          <button
            type="submit"
            className="submit-btn"
            aria-label="Send"
            disabled={disabled || !hasText}
          >
            <SendIcon size={17} />
          </button>
        </div>
      </div>
    </form>
  )
}
