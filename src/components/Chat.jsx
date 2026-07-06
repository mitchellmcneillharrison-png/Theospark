import { FlameMark } from './Logo.jsx'
import { MODES } from '../api/client.js'

// Group a flat message list into thread turns: one question + its answer.
function toTurns(messages) {
  const turns = []
  for (const m of messages) {
    if (m.role === 'user') {
      turns.push({ question: m, answer: null })
    } else if (turns.length > 0) {
      turns[turns.length - 1].answer = m
    }
  }
  return turns
}

export default function Thread({ messages, isThinking, endRef }) {
  const turns = toTurns(messages)

  return (
    <div className="thread">
      {turns.map((turn, i) => (
        <article className="turn" key={i}>
          <h2 className="question">{turn.question.content}</h2>
          <div className="answer-label">
            <FlameMark size={18} />
            Answer
            {turn.answer?.mode && (
              <span className="answer-mode">
                · {MODES[turn.answer.mode]?.label ?? turn.answer.mode}
                {turn.answer.denomination ? ` · ${turn.answer.denomination}` : ''}
              </span>
            )}
          </div>
          {turn.answer ? (
            <p className="answer-body">{turn.answer.content}</p>
          ) : (
            isThinking && (
              <div className="thinking">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            )
          )}
        </article>
      ))}
      <div ref={endRef} />
    </div>
  )
}
