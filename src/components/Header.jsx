import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const PAGE_TITLES = {
  '/dashboard': 'Overview',
  '/dashboard/complaints': 'Complaints',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/alerts': 'Urgent Alerts',
  '/dashboard/sentiment': 'Sentiment & Feedback',
  '/dashboard/fake-detection': 'Fake Detection',
  '/dashboard/duplicates': 'Duplicate Detection',
  '/dashboard/users': 'User Management',
  '/dashboard/reports': 'Reports',
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export default function Header() {
  const { pathname } = useLocation()
  const { auth } = useAuth()
  const { colors: C, theme, toggleTheme } = useTheme()

  const pageTitle = PAGE_TITLES[pathname] || 'Dashboard'
  const societyName = auth?.society_name || 'Housing Society'

  return (
    <div
      style={{
        height: 60,
        borderBottom: `1px solid ${C.border}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        justifyContent: 'space-between',
        background: C.surface,
        flexShrink: 0,
      }}
    >
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.text, lineHeight: 1.2 }}>
          {pageTitle}
        </div>
        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{societyName}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            padding: '5px 12px',
            borderRadius: 20,
            fontSize: 11,
            background: C.greenGlow,
            color: C.green,
            fontWeight: 600,
            border: `1px solid ${C.green}44`,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.green }} />
          System Online
        </div>

        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: C.surfaceHigh,
            border: `1px solid ${C.border}`,
            color: C.textDim,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.15s',
          }}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          A
        </div>
      </div>
    </div>
  )
}
