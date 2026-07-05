import { DENOMINATIONS, MODES } from '../api/client.js'

export default function SettingsPanel({ open, denomination, onDenominationChange, onClose }) {
  if (!open) return null

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div
        className="settings-panel"
        role="dialog"
        aria-label="Settings"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Settings</h2>

        <label className="settings-field">
          <span>Your denomination</span>
          <select
            value={denomination}
            onChange={(e) => onDenominationChange(e.target.value)}
          >
            {DENOMINATIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <p className="settings-hint">
          Theospark answers every question from this tradition’s perspective.
        </p>

        <div className="settings-modes">
          {Object.values(MODES).map((m) => (
            <div key={m.id} className="settings-mode">
              <strong>{m.label}</strong>
              <span>{m.tagline}</span>
            </div>
          ))}
        </div>

        <button className="settings-close" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  )
}
