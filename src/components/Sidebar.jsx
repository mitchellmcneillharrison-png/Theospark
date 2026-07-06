import Logo from './Logo.jsx'
import {
  PlusIcon,
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
        <Logo size={26} />
      </div>

      <button className="new-chat-btn" onClick={onNewChat}>
        <PlusIcon size={16} />
        New Thread
      </button>

      <nav className="sidebar-nav">
        <div className="nav-item" aria-hidden="true">
          <HistoryIcon size={17} />
          History
        </div>
        <ul className="history-list">
          {conversations.length === 0 && (
            <li className="history-empty">No threads yet</li>
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
        <button className="nav-item" onClick={() => onPlaceholder('Projects')}>
          <FolderIcon size={17} />
          Projects
        </button>
        <button className="nav-item" onClick={() => onPlaceholder('Profile')}>
          <UserIcon size={17} />
          Profile
        </button>
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item" onClick={onOpenSettings}>
          <GearIcon size={17} />
          Settings
        </button>
        <button className="nav-item" onClick={() => onPlaceholder('More')}>
          <MoreIcon size={17} />
          More
        </button>
      </div>
    </aside>
  )
}
