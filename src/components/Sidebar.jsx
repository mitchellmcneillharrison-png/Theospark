import Logo from './Logo.jsx'
import {
  PenIcon,
  HistoryIcon,
  FolderIcon,
  UserIcon,
  GearIcon,
  MoreIcon,
} from './Icons.jsx'

export default function Sidebar({
  conversations,
  activeId,
  onNewChat,
  onSelectConversation,
  onOpenSettings,
  onPlaceholder,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Logo />
      </div>

      <button className="new-chat-btn" onClick={onNewChat}>
        <PenIcon size={17} />
        New chat
      </button>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-heading">
            <HistoryIcon size={17} />
            History
          </div>
          <ul className="history-list">
            {conversations.length === 0 && (
              <li className="history-empty">No conversations yet</li>
            )}
            {conversations.map((c) => (
              <li key={c.id}>
                <button
                  className={`history-item${c.id === activeId ? ' active' : ''}`}
                  onClick={() => onSelectConversation(c.id)}
                  title={c.title}
                >
                  {c.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item" onClick={() => onPlaceholder('Projects')}>
          <FolderIcon size={18} />
          Projects
        </button>
        <button className="nav-item" onClick={() => onPlaceholder('Profile')}>
          <UserIcon size={18} />
          Profile
        </button>
        <button className="nav-item" onClick={onOpenSettings}>
          <GearIcon size={18} />
          Settings
        </button>
        <button className="nav-item" onClick={() => onPlaceholder('More')}>
          <MoreIcon size={18} />
          More
        </button>
      </div>
    </aside>
  )
}
