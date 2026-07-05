export function FlameMark({ size = 32 }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      <defs>
        <linearGradient id="flame-g" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0" stopColor="#c9364d" />
          <stop offset="1" stopColor="#7f1524" />
        </linearGradient>
      </defs>
      <path
        fill="url(#flame-g)"
        d="M33.4 4.6c.5 8.1-2.9 12.9-7.5 17.6-4.9 5-10.3 10.4-10.3 19.2 0 10.3 8 18 16.4 18 8.4 0 16.4-6.6 16.4-17.4 0-3.5-1.1-7-2.9-10-.6 2.4-2.4 4.6-4.3 5.6.9-2.6.9-6.3-.4-9.4-2.1-5.4-7-8.9-7.4-23.6z"
      />
      <path
        fill="#f4c9ce"
        d="M32.2 34.8c2.8 3.4 4.2 6.1 4.2 9.9 0 5.1-3.4 8.9-7.6 9.6 1.9-1.8 2.5-3.4 2.5-5.9 0-3.1-1.5-5.3-1.5-8.6 0-1.9 1.1-3.9 2.4-5z"
      />
    </svg>
  )
}

export default function Logo({ size = 30 }) {
  return (
    <div className="logo">
      <FlameMark size={size} />
      <span className="logo-word">Theospark</span>
    </div>
  )
}
